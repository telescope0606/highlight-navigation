/**
 * Name: highlight-navigation jQuery plugin
 * Author: Stephanie Fischer
 * Description: Provides keyboard and mouse navigation and highlighting for elements with items, such as rows belonging to tables, li's belonging to ul's and ol's, and a's belonging to nav's. Currently only tested with these elements, but should allow other elements to work as well, as long as there are no extraneous children that you do not want to be selectable within those. If there are, you will need to modify the switch statement to handle those cases. Please test and extend if you see a need to. At this time, it will only work for one plugin instance.
 */
;(function($){
  methods = {
   init: function(options){
    var self = this,
        $self = $(this);
    $.fn.highlightNavigation.self = $self;
    self.wrapper = $("<div class=\"highlight-navigation-container\"/>");
    $.fn.highlightNavigation.self
     .after(self.wrapper)
      .detach()
       .appendTo(self.wrapper);
    $.fn.highlightNavigation.elemObjTag = $.fn.highlightNavigation.self.prop("tagName");
    settings = $.extend({}, $.fn.highlightNavigation.defaults, options);
    this.selectedItem = {};
    $(document).on("keydown", $.proxy(methods.keyPress, self)); //bind keydown to keyPress function.
    $(document).on("click", $.proxy(methods.itemClick, self)); //bind click to itemClick function.
    $(document).on("touchstart", $.proxy(methods.itemClick, self)); //bind touchstart (mobile) to itemClick function.
    methods.selectFirst();
  },
  selectFirst: function(){
   var $firstItem = {},
       $allItems = methods.getAllItems();
   if($allItems){
    $firstItem = $allItems.eq(0);
    $firstItem.addClass("selected");
    $.fn.highlightNavigation.selectedItem = $firstItem; //Set public selectedItem var to first item.
    settings.onSelect(); //onSelect callback.
    settings.selectFirst(); //selectFirst callback.
   }
  },
  selectNext: function(direction){ //Apply highlighting for item we're navigating to.
   var $selectedItem = {},
       $currentSelectedItem = methods.getSelectedItem(),
       $allItems = methods.getAllItems();
   if(direction === -1 && (($.fn.highlightNavigation.elemObjTag === "NAV" && $currentSelectedItem.prevAll("a").length) || typeof $currentSelectedItem.prev().prop("tagName") !== "undefined")){ //Go to previous item, if it exists, and apply selected class.
    if($.fn.highlightNavigation.elemObjTag === "NAV"){
     $selectedItem = $currentSelectedItem.prevAll("a:first");
    }
    else{
     $selectedItem = $currentSelectedItem.prev();
    }
    $selectedItem.addClass("selected");
   }
   else if(direction === 1 && (($.fn.highlightNavigation.elemObjTag === "NAV" && $currentSelectedItem.nextAll("a").length) || typeof $currentSelectedItem.next().prop("tagName") !== "undefined")){ //Go to next item, if it exists, and apply selected class.
    selector = "a:first";
    if($.fn.highlightNavigation.elemObjTag === "NAV"){
     $selectedItem = $currentSelectedItem.nextAll("a:first");
    }
    else if($.fn.highlightNavigation.elemObjTag === "UL" || $.fn.highlightNavigation.elemObjTag === "OL"){
     $selectedItem = $currentSelectedItem.nextAll("li:first");
    }
    else{
     $selectedItem = $currentSelectedItem.next();
    }
    $selectedItem.addClass("selected");
   }
   if(!$.isEmptyObject($selectedItem)){ //New item was properly selected
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
   evt.preventDefault();
   if($("li, tr").has($(itemClicked)).length){ //if click event occured on an element contained within the item, then set selection to the containing item.
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
    case $.fn.highlightNavigation.elemObjTag.length: //Catch all for other elements. This grabs all of the children belonging to it. You may want to override this for certain elements with items you do not want included, ie: if there are header, h1, etc. tags inside of your element.
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
   var self = this;
   methods.getSelectedItem().removeClass("selected"); //Remove selected class
   $(document).off("keydown", $.proxy(methods.keyPress, self)); //unbind keydown from keyPress function.
   $(document).off("click", $.proxy(methods.itemClick, self)); //unbind click from itemClick function.
   $(document).off("touchstart", $.proxy(methods.itemClick, self)); //unbind touchstart (mobile) from itemClick function.
   $.fn.highlightNavigation.self.unwrap(); //Remove container element
  }
 };
 $.fn.highlightNavigation = function(method){
  $.fn.highlightNavigation.defaults = {
   navPrevItemKey: 38, //Up arrow
   navNextItemKey: 40, //Down arrow
   navActionKey: 13, //Enter
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