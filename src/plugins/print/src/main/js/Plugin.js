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
        var mywindow = window.open('', '', 'left=0,top=0,width=950,height=600,toolbar=0,scrollbars=0,status=0,addressbar=0'), isChrome = Boolean(mywindow.chrome);
        mywindow.document.write(editor.getWin().document.documentElement.innerHTML);
        mywindow.document.close(); // necessary for IE >= 10 and necessary before onload for chrome

        if (isChrome) {
          mywindow.onload = function () { // wait until all resources loaded
            mywindow.focus(); // necessary for IE >= 10
            mywindow.print(); // change window to mywindow
            mywindow.close();// change window to mywindow
          };
        } else {
          mywindow.document.close(); // necessary for IE >= 10
          mywindow.focus(); // necessary for IE >= 10
          mywindow.print();
          mywindow.close();
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