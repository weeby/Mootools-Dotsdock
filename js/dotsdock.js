/**
 * Dotsdock class (scroll few elements like in Android dots dock)
 * @author: Krzysztof Wilczek
 * @since: 30.10.2011
 **/
var DotsDock = new Class({
	
	Implements: [Options, Events],
	
	_element: null, // DOM element for DotsDock
	_items: [], // Dock elements list
	_wrapper: null, // Dock wrapper
	_menu: null, // Dock menu
	_animation_stop: false, // Animation main controll
	current: null, // Current showed element
	
	options: {
		dock_css_class: 'dotsdock',
		menu_css_class: 'dotsdock_menu',
		width: 200,
		height: 100,
		duration: 5000,
		elements_per_page: 1,
		show_even_one_dot: false,
		menu_destination: 'inside'
	},
	
	/**
	 * Object initialization, create wrapper, item list and assign options
	 * @param Object element
	 * @param Object options
	 * @return DotsDock
	 */
	initialize: function(element, options)
	{
		if (!element)
		{
			return false;
		}
		this._element = element;
		this.setOptions(options);
		
		this._render();
		if (!this._items)
		{
			this.destroy();
			return false;
		}
		this.current = this._items[0];
		this._showElement(this.current);
		this._animation.delay(this.options.duration, this);
		return this;
	},

	/**
	 * Create elements list for DotsDock
	 */
	_prepareElementsList: function()
	{
		var elements = this._element.clone().getChildren();
		var self = this;
		
		var element = new Element('div');
		for (i=0; i< elements.length; i++)
		{
			element.grab(new Element('div', {'html': elements[i].get('html')}));
			if ((i+1) % this.options.elements_per_page == 0) 
			{
				self._items.push({'menu': null, 'element': element});
				this._wrapper.grab(element);
				element = null;
				element = new Element('div');
			}
		}
		if (element.getChildren().length > 0)
		{
			self._items.push({'menu': null, 'element': element});
			this._wrapper.grab(element);
		}

	},
	
	/**
	 * Create new DotsDock, bulid wrapper and bind main events
	 */
	_render: function() {
		
		// Hide old DOM element
		this._element.setStyle('display', 'none');
		
		// Render main wrapper
		this._wrapper = new Element('div', {'class': this.options.dock_css_class});
		this._wrapper.setStyles({'width': this.options.width, 'height': this.options.height});
		this._wrapper.inject(this._element, 'before');
		
		// Add items to wrapper
		this._prepareElementsList();
		
		// Render item dots menu
		this._menu = new Element('div', {'class': this.options.menu_css_class});
		if (this.options.menu_destination == "inside")
        {            
            this._wrapper.grab(this._menu);
        }
        else
        {
            this.options.menu_destination.grab(this._menu);
        }
		
		var self = this;
		this._items.each(function(item) {
			if ((self._items.length == 1 && self.options.show_event_one_dot) || self._items.length > 1)
			{
				var link = new Element('a');
				link.addEvent('click', self.menuClick.bind(self, item));
				link.addEvent('mousedown', function(event) { event.stopPropagation();});
				self._menu.grab(new Element('div').grab(link));
				item.menu = link;
			}
			item.element.addClass('item');
			item.element.setStyles({'width': self.options.width, 'height': self.options.height});
		});		
	},
	
	/**
	 * Dock animation shows dock elements one by one
	 */
	_animation: function() {
		
		if (this._animation_stop)
		{
			return false;
		}
		var self = this;
		var element = null;
		
		// Find current element on items list
		for (i=0;i < this._items.length; i++)
		{
			if (this._items[i] == this.current)
			{
				element = this._items[i];
				break;
			}
		}
	
		if (!element)
		{
			return false;
		}
		
		// Hide previous element
		this._hideElement(this.current);
		if (i == this._items.length-1)
		{
			this.current = this._items[0];
		}
		else
		{
			this.current = this._items[i+1];
		}
		
		// Show new current element
		this._showElement(this.current);
	
		this._animation.delay(this.options.duration, this);
	},
	
	/**
	 * Click on dots menu item
	 * @param Object event
	 */
	menuClick: function(item, event) {
		
		if (!item)
		{
			return false;
		}
		this._animation_stop = true;
		this._hideElement(this.current);
		this.current = item;
		this._showElement(this.current);
		
	},
	
	/**
	 * Hide selected element
	 * @param Object item
	 */
	_hideElement: function(item) {
		if (!item)
		{
			return false;
		}
		item.element.fade('out');
		item.element.setStyle('z-index', 1);
		if (item.menu)
		{
			item.menu.removeClass('selected');	
		}
		
	},
	
	/**
	 * Show selected element 
	 * @param Object item
	 */
	_showElement: function(item) {
		if (!item)
		{
			return false;
		}
		item.element.fade('in');
		item.element.setStyle('z-index', 100);
		if (item.menu)
		{
			item.menu.addClass('selected');	
		}
		
	},
	
	/**
	 * Remove DotsDock DOM elements and efects
	 */
	destroy: function()
	{
		this._element.setStyle('display', 'block');
		this._wrapper.dispose();
		this._wrapper = null;
	}

});

/**
 * Standard Mootools Element extension 
 * add new method called: dotsdock (create new DotsDock contains all element DOM childrens)
 * @param Object options 
 * @return DotsDock
 */
Element.implement('dotsdock', function(){
	
	var options = arguments[0];	
	
	if (options != null) {
		var dotsdock = new DotsDock(this, options);
		this.store('dotsdock', dotsdock);		
	} 
	else 
	{
		var dotsdock = this.retrieve('dotsdock');	
		if (dotsdock != null) {
			return dotsdock;
		}
	}
	return this;

});
