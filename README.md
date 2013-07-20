**Highlight Navigation**
------------------------


Highlight Navigation enables keyboard, mouse, and touch element highlighting and navigation. Highlight and navigate table rows by pressing configurable keys. Perform any action specified via callback by upon pressing enter key on a row. Built to work for all elements with children. Other elements that this plugin has been tested for and confirmed working are: UL, OL, and NAV. Additional elements should work as well, with some caveats that I will discuss below. For ease of configuration, the plugin is left open in that all methods are exposed, and there are callbacks for all of the plugin’s events.

**jQuery support**: 1.7.1+

Testing
-------

The following elements have been tested with this plugin:

 - TABLE
 - OL 
 - UL 
 - NAV

Additional test cases are very welcome.

Contributing to Highlight Navigation
------------------------------------

Contributions and pull requests are very welcome. 

Highlight Navigation Demos
---------------------------------------
Demos are available here: http://telescope0606.github.io/


Highlight Navigation Credits, Donations
---------------------------------------

Built by Stephanie Fischer. There really is not much coming out of my pocket for this plugin, but I am struggling with Lyme disease and having to self-pay a good deal of the cost. If you would like to help, donations are appreciated. You can donate here: http://telescope0606.github.io/

Styling
-------

The plugin is meant to not get in the way of your site’s styling. Therefore, its CSS file is minimal, with only a selected class, and a collapsed border for tables. The styles are limited to the plugin’s container, and won’t interfere with the rest of your site.

API
---

Options
-------

- **keyboardNav**: Whether to enable keyboard navigation. *Optional.* Default: *true*.

The following options map the keyboard key codes for handling by the plugin. For a full reference of key codes that can be used, please see: http://protocolsofmatrix.blogspot.com/2007/09/javascript-keycode-reference-table-for.html

- **navPrevItemKey**: The key to map to previous item. *Optional.*

    Default: 38, the up arrow.

- **navNextItemKey**: The key to map to next item. *Optional.*

    Default: 40, the down arrow.

- **navActionKey**: The key to map to action. *Optional.*

    Default: 13, the Enter key.

Methods
-------

These methods are public, and callable from your code. Each of these methods has a callback.

 - **selectFirst**: Selects the first item.
 - **selectNext**: Selects the next item. 

     This method skips the next child if it is considered extraneous. Extraneous children are items that you commonly would not want to apply a selection & highlight to. An example is a BR tag within a NAV. Therefore, there is some logic in this method that explicitly looks for the next LI child, if the plugin is attached to a UL or OL, or the next A child, if the plugin is attached to a NAV. Otherwise, it behaves just as you would expect, by using the next and prev jQuery functions.

 - **selectItem**: Selects an item at a specified index.
 - **keyPress**: Processes a keyboard event.
 - **getAllItems**: Returns an object containing all items in the element.

     This method also skips any extraneous children belonging to the element. getAllItems explicitly looks for TBODY > TR belonging to TABLE, LI belonging to UL or OL, and A belonging to NAV. As mentioned previously, these are the only elements that the plugin has been tested with so far. However, Highlight Navigation was built to work with other elements as well. If you have no extraneous children within the other element you want to use, it will work just fine. If you do have extraneous children, then you will need to modify the switch statement to include a case statement for it.

 - **getSelectedItem**: Returns an object containing the selected item.
 - **getKeyCode**: Returns the key code that was pressed.

Additional Callbacks
--------------------

 - **onSelect**: Whenever an item is selected, this callback will execute.
 - **actionKeyPress**: Whenever an action key (ie: Enter) is pressed, this callback will execute.

Usage Examples
--------------


----------
<br>

**Basic usage of Highlight Navigation with a UL**


----------


*Include necessary CSS and JS files*

<code> 
 

     <link rel="stylesheet" type="text/css" href="../highlight-navigation.css" />
      <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
      <script src="../jquery.highlight-navigation.js"></script>

</code>

*Create UL that we want to make navigable*
<code> 

      <ul class=”navigateMe”>
       <li>test1 > <span class="aChild">list item child 1 > <span class="childDescendent">list item child of child</span></span></li>
       <li>test2</li>
       <li>test3</li>
       <li>test4</li>
       <li>test5</li>
      </ul>

</code>

*Call the Highlight Navigation plugin*
<code> 
 

     <script>
       $(document).ready(function(){
        $(".navigateMe").highlightNavigation();
       });
      </script>

</code>

----------
<br>

**Usage of Highlight Navigation plugin with a nav**

----------
<br>
In this example, the nav items are all on one line, therefore we want to be able to navigate them using the left and right arrow keys. Here is how to do so.
Include necessary CSS and JS files
<code>

      <link rel="stylesheet" type="text/css" href="../highlight-navigation.css" />
      <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
      <script src="../jquery.highlight-navigation.js"></script>

</code>
*Create NAV that we want to make navigable*
<code>

      <nav class=”navigateMe“>
       <a href="http://www.google.com">Google</a>
       <a href="http://www.jquery.com">jQuery</a>
       <a href="http://www.github.com">GitHub</a>
       <a href="http://sfischercode.wordpress.com">Stephanie Fischer's Code Share Blog</a>
      </nav>

</code>

*Call the Highlight Navigation plugin*

In this example, we are overwriting the default keys for previous and next to be the left and right arrows rather than the down and up arrows. Additionally, we want to open a new window that goes to the URL specified in the a tags when the user presses the Enter key or clicks on an item. This is accomplished with the actionKeyPress and itemClick callbacks.
<code>

      <script>
       $(document).ready(function(){
        $(".navigateMe")
         .highlightNavigation({
           navPrevItemKey: 37,
           navNextItemKey: 39,
           actionKeyPress: function(event, data){ //When action key (enter) is pressed, or row is clicked, go to applicable record.
            var $selectedRow = $(this).highlightNavigation("getSelectedItem");
            if($selectedRow.prop("href") !== undefined){
             window.open($selectedRow.prop("href"));
            }
           },
           itemClick: function(event, data){ //When action key (enter) is pressed, or row is clicked, go to applicable record.
            var $selectedRow = $(this).highlightNavigation("getSelectedItem");
            if($selectedRow.prop("href") !== undefined){
             window.open($selectedRow.prop("href"));
            }
           }
          });
       });
      </script>

</code>

----------
<br>

**Usage of Highlight Navigation plugin with a Mustache template & table**


----------
<br>

In this example, we are working with JSON data that is fed to a Mustache template to create a table of users. We then call the Highlight Navigation plugin on this table to make it navigable. We want to perform an action when the user hits Enter or clicks on a table row. Again, we use the actionKeyPress and itemClick callbacks to do this.
*Include necessary CSS and JS files*
<code>

      <link rel="stylesheet" type="text/css" href="../highlight-navigation.css" />
      <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
      <script src="http://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.0/mustache.min.js"></script>
      <script src="../jquery.highlight-navigation.js"></script>

</code>
*Set up Mustache template*
<code>

      <div id="users"></div>
      <script id="usersTpl" type="text/template">
       <h1>Listing Users</h1>
       <table class="table">
        <thead>
         <tr>
          <th>id</th>
          <th>username</th>
          <th>name</th>
          <th>email</th>
         </tr>
        </thead>
        <tbody>
         {{#users}}
          <tr data-id="{{id}}">
           <td>{{id}}</td>
           <td>{{username}}</td>
           <td>{{first_name}} {{last_name}}</td>
           <td>{{email}}</td>
          </tr>
         {{/users}}
        </tbody>
       </table>
      </script>

</code>

*Get JSON data, create the template, and then call the Highlight Navigation plugin*
<code>

      <script>
       $(document).ready(function(){
        $.getJSON("users.json", function(data){
         var template = $("#usersTpl").html(),
             html = Mustache.to_html(template, data);
         $("#users")
          .html(html);
         $(".table")
          .highlightNavigation({
           actionKeyPress: function(event, data){ //When action key (enter) is pressed, or row is clicked, go to applicable record.
            var $this = $(this),
                $selectedRow = $this.highlightNavigation("getSelectedItem"),
                keyCode = $this.highlightNavigation("getKeyCode"),
                $selectedRowID = $selectedRow.data("id");
            if(typeof $selectedRowID !== "undefined"){
             location.href = "users.html#" + $selectedRowID;
            }
           },
           itemClick: function(event, data){ //When action key (enter) is pressed, or row is clicked, go to applicable record.
            var $this = $(this),
                $selectedRow = $this.highlightNavigation("getSelectedItem"),
                $selectedRowID = $selectedRow.data("id");
            if(typeof $selectedRowID !== "undefined"){
             location.href = "users.html#" + $selectedRowID;
            }
           }
          });
         });
       });
      </script>

</code>

License
-------

Copyright (c) 2013 Stephanie Fischer (http://telescope0606.github.io/)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

