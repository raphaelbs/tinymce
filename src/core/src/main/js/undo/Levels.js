/**
 * Levels.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This module handles getting/setting undo levels to/from editor instances.
 *
 * @class tinymce.undo.Levels
 * @private
 */
define(
  'tinymce.core.undo.Levels',
  [
    "tinymce.core.util.Arr",
    "tinymce.core.undo.Fragments"
  ],
  function (Arr, Fragments) {
    var hasIframes = function (html) {
      return html.indexOf('</iframe>') !== -1;
    };

    var createFragmentedLevel = function (fragments) {
      return {
        type: 'fragmented',
        fragments: fragments,
        content: '',
        bookmark: null,
        beforeBookmark: null
      };
    };

    var createCompleteLevel = function (content) {
      return {
        type: 'complete',
        fragments: null,
        content: content,
        bookmark: null,
        beforeBookmark: null
      };
    };

    var createFromEditor = function (editor) {
      var fragments, content, trimmedFragments;

      fragments = Fragments.read(editor.getBody());
      trimmedFragments = Arr.map(fragments, function (html) {
        return editor.serializer.trimContent(html);
      });
      content = trimmedFragments.join('');

      return hasIframes(content) ? createFragmentedLevel(trimmedFragments) : createCompleteLevel(content);
    };

    var applyToEditor = function (editor, level, before) {
      if (level.type === 'fragmented') {
        Fragments.write(level.fragments, editor.getBody());
      } else {
        editor.setContent(level.content, { format: 'raw' });
      }

      editor.selection.moveToBookmark(before ? level.beforeBookmark : level.bookmark);
    };

    var getLevelContent = function (level) {
      return level.type === 'fragmented' ? level.fragments.join('') : level.content;
    };

    var isEq = function (level1, level2) {
      return getLevelContent(level1) === getLevelContent(level2);
    };

    /**
     * CHANGED:
     * Inserido método para comparar os níveis de undo sem olhar
     * dentro de classes com cabeçalho e rodapé.
     * 24/08/2017
     * Raphael Brandão
     */
    var isEqWithoutHeadersAndFooters = function (level1, level2) {
      return removeHeaderAndFooter(getLevelContent(level1)) === removeHeaderAndFooter(getLevelContent(level2));
    };

    /**
     * CHANGED:
     * Sanitizer para os leveis.
     * Remove o cabeçalho e rodapé para fazer a comparação.
     * 24/08/2017
     * Raphael Brandão
     */
    function removeHeaderAndFooter(html) {
      html = html.replace(/<!--(.*?)-->/g, '');
      html = findHtmlEndingTag(html, '<div class="pageHeader');
      html = findHtmlEndingTag(html, '<div class="pageFooter');
      return html;
    }

    /**
     * CHANGED:
     * Remove a TAG {filter} do HTML {html}
     * 24/08/2017
     * Raphael Brandão
     */
    function findHtmlEndingTag(html, filter) {
      if (html.indexOf(filter) < 0) {
        return html;
      }
      var result = html.substr(0, html.indexOf(filter));
      html = html.substr(html.indexOf(filter) + filter.length);
      var expEnding = 1;
      while (expEnding > 0) {
        html = html.substr(html.indexOf('<') + 1);
        if (html.charAt(0) === '/') {
          expEnding--;
          continue;
        }
        if (isHtmlTag('img')) {
          continue;
        }
        if (isHtmlTag('input')) {
          continue;
        }
        if (isHtmlTag('br')) {
          continue;
        }
        if (isHtmlTag('hr')) {
          continue;
        }
        expEnding++;
      }
      return findHtmlEndingTag(result + html.substr(html.indexOf('>') + 1), filter);

      function isHtmlTag(tag) {
        return html.substr(0, tag.length + 1) === tag + ' ';
      }
    }

    return {
      createFragmentedLevel: createFragmentedLevel,
      createCompleteLevel: createCompleteLevel,
      createFromEditor: createFromEditor,
      applyToEditor: applyToEditor,
      isEq: isEq,
      // CHANGED:
      isEqWithoutHeadersAndFooters: isEqWithoutHeadersAndFooters
    };
  }
);