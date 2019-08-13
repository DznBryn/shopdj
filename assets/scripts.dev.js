/* APP JS */
// @codekit-prepend "_setup.js"


(function($){
	
	window[window.object_name] = {
							/*
							** Function: adventure.inititalize();
							**	- fires primary methods
							*/
		initialize		:	function(){
								
								$window.trigger(window.object_name+'.initialize', self);
								$window.trigger(window.object_name+'.add_methods', self);
								
								$(document).ready(function(){ self.document_ready(); });
							},
							
							/*
							** Object: elements
							**	- will be used to cache global elements;
							**	- adventure.methods._cache_elements() will cache elements
							**	- fired in adventure.runtime_methods();
							*/
		elements		:	{},
		properties		:	{},
		methods			:	{
			
								_add :				function(where, what) {
														jQuery.extend(true, self[where], what);
													},
													
								_setup_events :		function(events) {
														for( var event in events ) {
															
															var e = typeof events[event].event !== 'undefined' ?  events[event].event : event;
															
															if( events[event].data ) {
																events[event].element.on(e, events[event].data, events[event].action);
															}else{
																events[event].element.on(e, events[event].action);
															}
														}
													},
								/*
								** Function: adventure.methods._cache_elements();
								**  - uses the same selectors object to cache elements
								*/
								_cache_elements :	function(selectors){
														for( var key in selectors ) {
															selectors[key] = $(selectors[key]);
														}
									
													},
								/*
								** VENDROR METHODS
								**  - methods to build or interact with 3rd party vendor plugins
								*/
								vendors :			{}
							},
		events			:	{},
		document_ready	:	function() {
			
								// Global element caching must always run first
								$window.trigger(window.object_name+'._cache_elements', self);
								self.methods._cache_elements(self.elements);
								
								// Gather all events and assign them 
								$window.trigger(window.object_name+'._setup_events', self);
								self.methods._setup_events(self.events);
								
								self.elements.window.trigger(window.object_name+'._document_ready', self);
								
							}
	};
	
	var self = window[window.object_name],
		$window = $(window);
	
	window[window.object_name].initialize();
	
})(jQuery);