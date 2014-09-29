


(function($) {

	$.widget("kel.form_builder", {

	    options: {
	        fields: [],
	        buttons: [],
	        align: 'block',
	        field_wrapper_name:'bootstrap',
	        //field_wrapper_function:null, //is the function that wraps form elements - used to bootstrap wrap form fields.
	        field_wrapper_functions:{},
	    },
	    
	    _next_id:0,
	    //_ids_used:[],
		
		_create: function () {
			var self = this;
			var container = this.element;
			
			self._field_wrapper_presets = {

	            'bootstrap': function(form_field_element, field_attrs) {
	                    var wrapper = self._get_form_field_group(field_attrs).append(
	                        self._get_label(field_attrs.label),
	                        form_field_element,
	                        self._get_validation_icon(),
	                        self._get_helper_block(field_attrs.helpblock)
	                    );
	                    
	                    return wrapper;
	                }
			};
			
			
		    container.append(self._build_form());
		},
		
		_destroy: function()
		{
			
		},
	    
	    _field_wrappers : null,
	    
	    _getRandomNumber: function (){
	        return Math.floor(Math.random() * 9999);
	    },
	    
	    _get_next_id : function()
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
	    	
			return self._get_next_id();*/
	    	return self._next_id++;
	    	
	    },
	
		_build_form_buttons: function (buttons) {
			var self = this;
	        var items = [];
	        $.each(buttons, function(index, button) {
	    
	            var item = self
	            	._build_element_from_json(
            			'button', 
            			{
            				id: (button.id || 'button_' + self._get_next_id()), 
            				'class': 'btn' + (button.validationState?' btn-' + button.validationState:'') + ' btn-' + (button.size || 'lg')
	        			}
	            	)
	            	.text((button.label || 'submit'))
	            	.addClass(button.classNames)
	            	;
	            
	            if (button.onSubmit) {
	
	                $(document)
	                	.on(
	            			'click', 
	            			'#' + item.attr('id'),  
	            			function(e) {
	            				e.preventDefault();
	            				var formValues = $('#' + e.target.id ).closest('form').serializeArray();
	            				button.onSubmit(formValues);
	            			}
	                	);
	            }
	            items.push(item);
	        });
	        
	        return $("<div class='form-group button-set' />")
	        	.append(
	        			$("<div class='col-sm-12' />")
	        				.append(items)
    			);
	    },
	
	    _get_helper_block: function(help_text) {
	        return (help_text?$("<p class='help-block'>" + help_text + "</p>") : null);
	    },
	
	    _get_validation_icon: function (){
	       return $("<span class='glyphicon form-control-feedback'></span>");
	    },
	
	    _get_form_field_group: function(options){
	    	options = options?options:{};
	        return $("<div class='form-group'/>").addClass(options.classNames);
	    },
	    
	    _get_label: function(text){
	        return (text?$("<label class='control-label'>" + text + "</label>"):null);
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
		    
	    	self._field_wrappers = $.extend(self._field_wrapper_presets, self.options.field_wrapper_functions); //merge wrappers
	    	var field_wrapper_function = self._field_wrappers[self.options.field_wrapper_name];
	    	
	        var form = $("<form role='form' />").addClass(self.options.classNames);
	        
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
	
	            var item = null;
	            //var adjustedFormElement = addNameAndID( item );
	
	            switch(field.type){   
	
	                case 'radio':
	                    item = $("<div/>");
	                    item.append(self._create_radios(field.name, field.radios));
	                    break;
	
	                case 'select':
	                    item = 
	                    	self._append_attrs_from_json(
	                    			self._build_element_form_field_from_json(
	                    					'select', 
	                    					{
	                    						name:field.name, 
	                    						id: field.id
	                						}
	            					),
	            					field, 
	            					['type','multiple','required']
	                    	);
	                    item.append(self._create_options(field.options));
	                    break;
	
	                case 'checkbox':
	                    item = $("<div/>");
	                    item.append(self._create_checkboxes(field.name, field.checkboxes));
	                    break;
	
	                case 'file':
	                    item = self._append_attrs_from_json(
	                    		self._build_element_form_field_from_json(
	                        		'input', 
	                        		{
	                        			name:field.name, 
	                        			id: field.id
	                    			}
	                        ),
	                        field, 
	                        ['required']
	                    );
	                    break;
	
	                case 'textarea':
	                    item = self._append_attrs_from_json(
	                    		self._build_element_form_field_from_json(
	                        		'textarea', 
	                        		{
	                        			name:field.name, 
	                        			id: field.id
	                    			}
	                    	),
	                        field, 
	                        ['rows', 'required', 'maxLength']
	                    );
	                    break;
	
	                default:
	                    item = self._append_attrs_from_json(
	                    		self._build_element_form_field_from_json(
	                        		'input', 
	                        		{
	                        			name:field.name, 
	                        			id: field.id
	                    			}
	                    	),
	                        field, 
	                        ['type','placeholder', 'required', 'pattern', 'maxLength']
	                    );
	                    break;
	            }
	            
	            if(item)
	            {
	            	item.data('extra-attrs', field);
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
		        			'id':'form_field_' + (attrs.id?attrs.id:attrs.name),
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
	            
	            if(is_ok)
	                element.attr(name, attrs[name]);
	        }
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
	    
	    _create_checkboxes: function (name, checkboxes) {
	        var items = [];
	        $.each(checkboxes, function(index, checkbox) {
	            var item = 
	                $("<div class='checkbox' />")
	                    .append(
	                        $("<label/>")
	                        .append(
	                            "<input type='checkbox' id='" + checkbox.id + "' name='" + name + "[" + items.length + "]' value='" + (checkbox.value || checkbox.label) + "'>" + checkbox.label + "</input>"
	                        )
	                    );
	            items.push(item);
	        });
	        return items;
	    },
	    
	    _create_radios: function (name, radios) {
	        var items = [];
	        $.each(radios, function(index, radio) {
	            var item = 
	                $("<div class='radio' />")
	                    .append(
	                        $("<label/>")
	                        .append(
	                            "<input type='radio' id='" + radio.id + "' name='" + name + "' value='" + (radio.value || radio.label) + "'>" + radio.label + "</input>"
	                        )
	                    );
	            items.push(item);
	        });
	        return items;
	    }
   
	});
	
})(jQuery);

