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
		duration: 5000
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
		
		var elements = this._element.getChildren();
		var self = this;
		elements.each(function(item) {
			self._items.push({'menu': null, 'element': item});
		});
		if (!this._items)
		{
			return false;
		}
		this.current = this._items[0];
		
		this.setOptions(options);
		this._render();
		this._showElement(this.current);
		this._animation.delay(this.options.duration, this);
		return this;
	},
	
	/**
	 * Create new DotsDock, bulid wrapper and bind main events
	 */
	_render: function() {
		// Render main wrapper
		this._wrapper = new Element('div', {'class': this.options.dock_css_class});
		this._wrapper.setStyles({'width': this.options.width, 'height': this.options.height});
		this._wrapper.inject(this._element, 'before');
		this._wrapper.grab(this._element);
		
		// Render item dots menu
		this._menu = new Element('div', {'class': this.options.menu_css_class});
		this._wrapper.grab(this._menu);
		
		var self = this;
		this._items.each(function(item) {
			var link = new Element('a');
			link.addEvent('click', self.menuClick.bind(self, item));
			self._menu.grab(link);
			item.menu = link;
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
		item.menu.removeClass('selected');
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
		item.menu.addClass('selected');
	},
	
	/**
	 * Remove DotsDock DOM elements and efects
	 */
	destroy: function()
	{
		this._element.inject(this._wrapper, 'before');
		this._wrapper.dispose();
		this._menu.dispose();
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
