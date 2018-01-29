/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the print plugin.
 *
 * @class tinymce.print.Plugin
 * @private
 */
define(
  'tinymce.plugins.print.Plugin',
  [
    'tinymce.core.PluginManager'
  ],
  function (PluginManager) {
    PluginManager.add('print', function (editor) {
      editor.addCommand('mcePrint', function () {
        var mywindow;
        if (window.chrome) {
          // if chrome, opens print preview
          mywindow = window.open('', '_blank');
          mywindow.document.write(editor.getWin().document.documentElement.innerHTML);
          mywindow.document.close(); // necessary for IE >= 10 and necessary before onload for chrome
          mywindow.onload = function () {
            mywindow.focus(); // necessary for IE >= 10
            mywindow.print(); // change window to mywindow
            mywindow.close();// change window to mywindow
          };
        } else if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent)) {
          // if IE 9, 10 or 11, open new window and print
          mywindow = window.open('', '_blank');
          mywindow.document.write(editor.getWin().document.documentElement.innerHTML);
          mywindow.document.close(); // necessary for IE >= 10 and necessary before onload for chrome
          mywindow.focus(); // necessary for IE >= 10
          mywindow.print(); // change window to mywindow
          mywindow.close();// change window to mywindow
        } else {
          // if other browser, fire an event for custom handling
          editor.fire('mcePrintNotChrome', { value: editor.getWin().document.documentElement.innerHTML }); // CHANGED: added
        }
      });

      editor.addButton('print', {
        title: 'Print',
        cmd: 'mcePrint'
      });

      editor.addShortcut('Meta+P', '', 'mcePrint');

      editor.addMenuItem('print', {
        text: 'Print',
        cmd: 'mcePrint',
        icon: 'print',
        shortcut: 'Meta+P',
        context: 'file'
      });
    });

    return function () { };
  }
);