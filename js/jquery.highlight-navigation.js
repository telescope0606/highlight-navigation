/**
 * Name: Highlight Navigation jQuery plugin
 * Author: Stephanie Fischer
 * Demos & documentation: https://github.com/telescope0606/highlight-navigation
 * Description: Provides keyboard and mouse navigation and highlighting for elements with items, such as rows belonging to tables, li's belonging to ul's and ol's, a's belonging to nav's, and dt's belonging to dl's. Currently only tested with these elements, but other elements should work as well, as long as there are no extraneous children that you do not want to be selectable within those. If there are, you will need to modify a couple spots to handle those cases. Those spots are denoted in the comments. Please extend if you see a need to. At this time, it will only work for one plugin instance. To do: enable more than one plugin instance & use a key to switch between them, allow a code edit in just one spot to ease modification needs for non-explicitly handled elements containing those extraneous children.
 */
;(function($){
  var methods = {
   init: function(options){
    $.fn.highlightNavigation.self = this;
    self.wrapper = $("<div class=\"highlight-navigation-container\"/>");
    $.fn.highlightNavigation.self
     .after(self.wrapper)
     .detach()
     .appendTo(self.wrapper);
    $.fn.highlightNavigation.elemObjTag = $.fn.highlightNavigation.self.prop("tagName");
    settings = $.extend({}, $.fn.highlightNavigation.defaults, options);
    self.selectedItem = {};
    if(settings.keyboardNav){
     $(document).on("keydown.highlightNav", $.proxy(methods.keyPress, self)); //bind keydown to keyPress function.
    }
    $(document).on("click.highlightNav", $.proxy(methods.itemClick, self)); //bind click to itemClick function.
    $(document).on("touchstart.highlightNav", $.proxy(methods.itemClick, self)); //bind touchstart (mobile) to itemClick function.
    methods.selectFirst();
  },
  selectFirst: function(){
   var $allItems = methods.getAllItems();
   if($allItems.length){
    $.fn.highlightNavigation.selectedItem = $allItems.eq(0).addClass("selected"); //Set selectedItem var to first item.
    settings.onSelect(); //onSelect callback.
    settings.selectFirst(); //selectFirst callback.
   }
  },
  selectNext: function(direction){ //Apply highlighting for item we're navigating to.
   var $selectedItem = {},
       $currentSelectedItem = methods.getSelectedItem(),
       $allItems = methods.getAllItems();
   if(typeof $currentSelectedItem === "undefined"){
    $.error("Ensure that your elements are correctly set up. Relationship must be PARENT > CHILD. Othewise, ensure any extraneous children are skipped.");
   }
   if(direction === -1 && (($.fn.highlightNavigation.elemObjTag === "NAV" && $currentSelectedItem.prevAll("a").length) || typeof $currentSelectedItem.prev().prop("tagName") !== "undefined")){ //Go to previous item, if it exists, and apply selected class. Note the usage of prevAll below, which allows us to bypass extraneous items that may be located within the NAV and DL tags. You will want to add a else if here, if you need to do the same for any other elements.
    if($.fn.highlightNavigation.elemObjTag === "NAV"){
     $selectedItem = $currentSelectedItem.prevAll("a:first");
    }
    else if($.fn.highlightNavigation.elemObjTag === "DL"){
     $selectedItem = $currentSelectedItem.prevAll("dt:first");
    }
    else{
     $selectedItem = $currentSelectedItem.prev();
    }
    $selectedItem.addClass("selected"); //apply selected class to new selected item.
   }
   else if(direction === 1 && (($.fn.highlightNavigation.elemObjTag === "NAV" && $currentSelectedItem.nextAll("a").length) || typeof $currentSelectedItem.next().prop("tagName") !== "undefined")){ //Go to next item, if it exists, and apply selected class.
    switch($.fn.highlightNavigation.elemObjTag){
     case "NAV":
      $selectedItem = $currentSelectedItem.nextAll("a:first");
      break;
     case "UL":
      $selectedItem = $currentSelectedItem.nextAll("li:first");
      break;
     case "OL":
      $selectedItem = $currentSelectedItem.nextAll("li:first");
      break;
     case "DL":
      $selectedItem = $currentSelectedItem.nextAll("dt:first");
      break;
     default:
      $selectedItem = $currentSelectedItem.next();
    }
    $selectedItem.addClass("selected");
   }
   if(!$.isEmptyObject($selectedItem) && $selectedItem.length){ //New item was properly selected
    $currentSelectedItem.removeClass("selected"); //Remove selected class from current item.
    $.fn.highlightNavigation.selectedItem = $selectedItem; //Set new selectedItem.
    settings.onSelect(); //onSelect callback.
    settings.selectNext(); //selectNext callback.
   }
  },
  keyPress: function(e){ //Handle key press.
   var keyCode = "",
       direction = "";
   e.preventDefault();
   if(window.event){
    keyCode = window.event.keyCode;
   }
   else if(e){
    keyCode = e.which;
   }
   direction = (keyCode == settings.navPrevItemKey)?-1:(keyCode == settings.navNextItemKey)?1:0; //Previous or Next key was pressed, select applicable item.
   if(direction != 0){
    methods.selectNext(direction); //Call selectNext on item we're navigating to.
   }
   if(keyCode == settings.navActionKey){ //Action key (ie: Enter) was pressed, take applicable action defined in callback.
    settings.actionKeyPress();
   }
   $.fn.highlightNavigation.keyCode = keyCode;
   settings.keyPress(); //keyPress callback
  },
  itemClick: function(e, data){ //Perform item click.
   var self = this,
       evt = (e)?e:event,
       itemClicked = (evt.srcElement)?evt.srcElement:evt.target,
       $allItems = methods.getAllItems(),
       $itemClicked = {},
       $selectedItem = methods.getSelectedItem();
   if(evt.which === 1){ //If a left click, handle click event, otherwise allow normal click behavior
    evt.preventDefault();
    if($("li, tr").has($(itemClicked)).length){ //If click event occured on an element contained within the item, then set selection to the containing item.
     $itemClicked = $("li, tr").has($(itemClicked));
    }
    else{
     $itemClicked = $(itemClicked);
    }
    if($itemClicked.parent().prop("tagName") !== "THEAD"){ //If table, only apply selection for the rows that are not in the table header.
     $allItems.removeClass("selected"); //Remove selected class from all other items.
     $itemClicked.addClass("selected"); //Apply selected class to item just clicked.
     $.fn.highlightNavigation.selectedItem = $itemClicked; //Set selectedItem.
     settings.itemClick(); //itemClick callback
    }
   }
  },
  getAllItems: function(){ //Return all items.
   switch($.fn.highlightNavigation.elemObjTag){
    case "TABLE":
     return $.fn.highlightNavigation.self.find("tbody tr");
     break;
    case "UL":
     return $.fn.highlightNavigation.self.find("li");
     break;
    case "OL":
     return $.fn.highlightNavigation.self.find("li");
     break;
    case "NAV":
     return $.fn.highlightNavigation.self.find("a");
     break;
    case "DL":
     return $.fn.highlightNavigation.self.find("dt");
     break;
    case $.fn.highlightNavigation.elemObjTag.length: //Catch all for other elements. This grabs all of the children belonging to it. You will want to override this by adding a case statement above for elements with any items you do not want included, ie: if there are header, h1, etc. tags inside of your element.
     return $.fn.highlightNavigation.self.children();
     break;
    default:
     return false;
   }
   settings.getAllItems();
  },
  getSelectedItem: function(){ //Public method to return selected item.
   return $.fn.highlightNavigation.selectedItem;
  },
  selectItem: function(index){ //Public method to set and return the selected item.
   var allItems = methods.getAllItems(),
       $selectedItem = $(allItems.get(index));
   allItems.removeClass("selected"); //Remove selected class from all other items.
   $selectedItem.addClass("selected"); //Apply selected class to newly selected item.
   $.fn.highlightNavigation.selectedItem = $selectedItem; //Set selectedItem.
   settings.onSelect(); //onSelect callback.
   return $selectedItem; //return newly selected item.
  },
  getKeyCode: function(){ //Return keycode.
   return $.fn.highlightNavigation.keyCode;
  },
  destroy: function(){ //Undo everything
   methods.getSelectedItem().removeClass("selected"); //Remove selected class
   $(document).off(".highlightNav"); //unbind events.
   $.fn.highlightNavigation.self.unwrap(); //Remove container element
  }
 };
 $.fn.highlightNavigation = function(method){
  $.fn.highlightNavigation.defaults = {
   navPrevItemKey: 38, //Up arrow
   navNextItemKey: 40, //Down arrow
   navActionKey: 13, //Enter
   keyboardNav: true, //Whether to enable keyboard navigation
   selectFirst: function(){},
   selectNext: function(){},
   onSelect: function(){},
   keyPress: function(){},
   itemClick: function(){},
   getAllItems: function(){},
   selectItem: function(){},
   getKeyCode: function(){},
   actionKeyPress: function(){}
  };
  if(methods[method]){
   return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  }
  else if(typeof method === "object" || !method){
   return methods.init.apply(this, arguments);
  }
  else{
   $.error("Method " + method + " does not exist in highlight-navigation");
  }
 };
})(jQuery);
