


(function($) {

	$.widget("kel.form_builder", {

	    options: {
	    	attrs:{}, //form attributes
	        fields: [],
	        buttons: [],
	        field_wrapper_name:'bootstrap',
	        //field_wrapper_function:null, //is the function that wraps form elements - used to bootstrap wrap form fields.
	        field_wrapper_functions:{},
	        on_events:{
	        	field_created:null
	        }
	    },
	    
	    _next_auto_id:0,
	    //_ids_used:[],
		
		_create: function () {
			var self = this;
			var container = this.element;
			
			self._field_wrapper_presets = {

	            'bootstrap': function(form_field_element, field_attrs) {
	                    var wrapper = self._get_form_field_group().append(
	                        self._get_label(field_attrs.label),
	                        form_field_element,
	                        //self._get_validation_icon(),
	                        self._get_helper_block(field_attrs.helpblock)
	                    );
	                    
	                    return wrapper;
	                }
			};
			
			var form = self._build_form();
		    container.append(form);
		    return form;
		},
		
		_destroy: function()
		{
			
		},
	    
	    _getRandomNumber: function (){
	        return Math.floor(Math.random() * 9999);
	    },
	    
	    _get_next_auto_id : function()
	    {
	    	var self = this;
	    	/*var id = self._getRandomNumber();
	    	var is_found = false;
			for(var i=0;i<self._ids_used.length;i++)
			{
				if(id == _self._ids_used[i])
				{
					is_found = true;
					break;
				}
			}
	    	
			if(!is_found)
			{
				self._ids_used.push(id);
				return id;
			}
	    	
			return self._get_next_auto_id();*/
	    	return self._next_auto_id++;
	    	
	    },
	
		_build_form_buttons: function (buttons) {
			var self = this;
	        var items = [];
	        $.each(buttons, function(index, button) {
	    
	            var item = self
	            	._build_element_from_json(
            			'button', 
            			{
            				id: (button.id || 'button_' + self._get_next_auto_id()), 
            				'class': 'btn' + (button.validationState?' btn-' + button.validationState:'') + ' btn-' + (button.size || 'lg')
	        			}
	            	)
	            	.text((button.label || 'submit'))
	            	;
	            
	            if(button.attrs)
            	{
	            	self._append_attrs_from_json(item,button.attrs);
            	}
	            
	            if (button.onSubmit) {
	
	                item
	                	.on(
	            			'click',   
	            			function(e) {
	            				e.preventDefault();
	            				var form = $(item).closest('form');
	            				button.onSubmit(form, form.serializeArray());
	            			}
	                	);
	            }
	            if(button.onClick)
	            	item.on("click", button.onClick);
	            
	            items.push(item);
	        });
	        
	        return (
	        		$("<div />")
	        		.addClass('form-group button-set')
	        		.append(
	        				$("<div />")
	        					.addClass('col-sm-12')
	        					.append(items)
	        		)
	        );
	    },
	
	    _get_helper_block: function(help_text) {
	        return (
	        		help_text?
	        				$("<p />")
	        					.addClass('help-block')
	        					.text(help_text)
        			: 
        					null
	        );
	    },
	
	    _get_validation_icon: function (){
	       return (
	    		   $("<span/>")
	    		   		.addClass('form-control-feedback')
	       );
	    },
	
	    _get_form_field_group: function(){
	        return (
	        		$("<div/>")
	        			.addClass('form-group')
	        			.addClass('has-feedback')
	        			.addClass()
	        );
	    },
	    
	    _get_label: function(text){
	        return (
	        		text?
	        				$("<label/>")
	        					.text(text) 
	        					.addClass('control-label')
    				:null
	        );
	    },
	    
	    /*_get_json_to_field_groups: function(attrs){
	    	var self = this;
	        var items = [];
	        $.each(self.options.fields, function(index, item) {
	           var form_element = self.get_json_to_form_fields();
	            
	        });
	        
	        return items;
	    },*/
	    
	    _build_form: function(){
		    var self = this;
		    
	    	var field_wrappers_merged = $.extend(self._field_wrapper_presets, self.options.field_wrapper_functions); //merge wrappers
	    	var field_wrapper_function = field_wrappers_merged[self.options.field_wrapper_name];
	    	
	        var form = $("<form role='form' />");
	        
	        self._append_attrs_from_json(form, self.options.attrs);
	        
	        var field_groups = [];
	        $.each(self._build_form_fields(), function(index, item)
	        		{
	        			var field_attrs = item.data('extra-attrs');
	        			field_groups.push(field_wrapper_function(item, field_attrs));  
	        		}
	        );
	        
	        form.append(field_groups);
	        form.append(self._build_form_buttons(self.options.buttons));
	        return form;
	    },
	    
	    _build_form_fields: function()
	    {
	    	var self = this;
	        var items = [];
	        $.each(self.options.fields, function(index, field) {
	        	field_attrs = $.extend({},field.attrs);
	        	
	        	field_attrs.id = (field_attrs.id?field_attrs.id:(field_attrs.name?(field_attrs.name):null));
	        	
	            var item = null;
	            //var adjustedFormElement = addNameAndID( item );
	
	            switch(field.type){   
	
	                case 'radio':
	                    item = $("<div/>");
	                    item.append(self._create_radios(field_attrs.id, field_attrs.name, field_attrs.radios));
	                    break;
	
	                case 'select':
	                    item = 
	                    	self._append_attrs_from_json(
	                    			self._build_element_form_field_from_json(
	                    					'select', 
	                    					{
	                    						name:field_attrs.name, 
	                    						id: field_attrs.id
	                						}
	            					),
	            					field_attrs, 
	            					['type','multiple','required']
	                    	);
	                    item.append(self._create_options(field_attrs.options));
	                    break;
	
	                case 'checkbox':
	                    item = $("<div/>");
	                    item.append(self._create_checkboxes(field_attrs.id, field_attrs.name, field_attrs.checkboxes));
	                    break;
	
	                case 'file':
	                    item = self._append_attrs_from_json(
	                    		self._build_element_form_field_from_json(
	                        		'input', 
	                        		{
	                        			name:field_attrs.name, 
	                        			id: field_attrs.id
	                    			}
	                        ),
	                        field_attrs, 
	                        ['required']
	                    );
	                    break;
	
	                case 'textarea':
	                    item = self._append_attrs_from_json(
	                    		self._build_element_form_field_from_json(
	                        		'textarea', 
	                        		{
	                        			name:field_attrs.name, 
	                        			id: field_attrs.id
	                    			}
	                    	),
	                        field_attrs, 
	                        ['rows', 'required', 'maxLength']
	                    );
	                    break;
	
	                default:
	                    item = self._append_attrs_from_json(
	                    		self._build_element_form_field_from_json(
	                        		'input', 
	                        		{
	                        			name:field_attrs.name, 
	                        			id: field_attrs.id
	                    			}
	                    	),
	                        field_attrs 
	                        //['type','placeholder', 'required', 'pattern', 'maxLength']
	                    );
	                    break;
	            }
	            
	            if(item)
	            {
	            	item.data('extra-attrs', field.attrs);
	            	if(self.options.on_events.field_created)
	            		self.options.on_events.field_created(item);
	            		
	                items.push(item);
	            }
	
	        });
	        return items;
	    },
	    
	    _build_element_form_field_from_json: function(tag_name, attrs)
	    {
	        return this._build_element_from_json(
	        		tag_name, 
		        		{
		        			'class':'form-control', 
		        			'name':attrs.name, 
		        			'id': attrs.id,
		        			//'data-extra-attrs': attrs
	        			}
    				);
	    },
	    
	    _build_element_from_json: function(tag_name, attrs, attrs_allowed)
	    {
	        return this._append_attrs_from_json($('<' + tag_name + ' />'), attrs, attrs_allowed);
	        
	    },
	    
	    _append_attrs_from_json: function(element, attrs, attrs_allowed){
	               
	        for(var name in attrs)        
	        {
	            var is_ok = false;
	            if(attrs[name] !== null)
            	{
		            if(attrs_allowed)
		            {
		                for(var i=0;i<attrs_allowed.length;i++)
		                {
		                    var match_name = attrs_allowed[i];                 
		                    if(name == match_name)
		                    {
		                        is_ok = true;
		                        break;
		                    }
		                }
		            }
		            else
		                is_ok = true; //no allowed list
            	}
	            if(is_ok)
	                element.attr(name, attrs[name]);
	        }
	        
	        element.attr("required")?element.attr("aria-required",true):null;
	
	        return element;
	    },
	    
	    _create_options: function (options) {
	        var items = [];
	        $.each(options, function(index, option) {
	            var item = $("<option>" +  option.label +"</option>");
	            if(option.value)
	                item.attr("value", option.value);
	            
	            items.push(item);
	        });
	        return items;
	    },
	    
	    _create_checkboxes: function (id, name, checkboxes) {
	        var items = [];
	        $.each(checkboxes, function(index, checkbox) {
	            var item = 
	                $("<div/>")
	                	.addClass('checkbox')
	                    .append(
	                        $("<label/>")
	                        .append(
	                            $("<input type='checkbox' value='" + (checkbox.value || checkbox.label) + "'>" + checkbox.label + "</input>")
	                            	.attr('name',name?name + '[' + items.length + ']':null)
	                            	.attr('id', checkbox.id?checkbox.id:(id?(id + "_" + items.length):null))
	                        )
	                    );
	            items.push(item);
	        });
	        return items;
	    },
	    
	    _create_radios: function (id, name, radios) {
	        var items = [];
	        $.each(radios, function(index, radio) {
	            var item = 
	                $("<div/>")
	                	.addClass("radio")
	                    .append(
	                        $("<label/>")
	                        .append(
	                            $("<input type='radio' value='" + (radio.value || radio.label) + "'>" + radio.label + "</input>")
	                            	.attr('name',name?name:null)
                    				.attr('id', radio.id?radio.id:(id?(id + "_" + items.length):null))
	                        )
	                    );
	            items.push(item);
	        });
	        return items;
	    }
   
	});
	
})(jQuery);

