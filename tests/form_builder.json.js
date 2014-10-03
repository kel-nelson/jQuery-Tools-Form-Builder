var json_data = 
{

		fields: [
		         {type: 'text', attrs: {
	        	 name: 'first_name',
            placeholder: 'benjamin', 
            validationState: 'success',
            helpblock: 'enter your first name',
            id: 'firstName', 
            label: 'First Name',  
	         required:true,
	         maxLength:12
	         }
	        },
	
	        {type: 'text', attrs: {
	        	name: 'last_name',
	            placeholder: 'cripps',
	            validationState: 'success',
	            helpblock: 'please enter first name',
	            label: 'Last Name',
            	required:true,
            	maxLength:12
	            }
	        },
	        
	        {type: 'email', attrs: {
	        	name: 'email',
	            placeholder: 'email@something.net',
	            validationState: 'success',
	            helpblock: 'please enter your email',
	            label: 'email',
            	required:true,
            	maxLength:50
	            }
	        },
	        
	        {type: 'text', attrs: {
	        	name: 'phone',
	            placeholder: 'xxx-xxx-xxxx',
	            validationState: 'success',
	            helpblock: 'please enter your phone',
	            label: 'Phone',
            	required:true,
            	maxLength:12,
            	'data-placeholder':'___-___-____',
    			'data-mask':'000-000-0000'            	
	            },
	        
	        },	        
	
	        {type: 'radio', attrs: {
	        	name: 'fav_food',
	            label: 'select your favorite food.', 
	            radios: [ 
	                { label: 'pizza' }, 
	                { label: 'tacos' }, 
	                { label: 'wings' } 
	            ]}
	        },
	        
	        {type: 'checkbox', attrs: {
	        	name: 'fav_drinks',
	            label: 'select your favorite drink.', 
	            checkboxes: [ 
	                { value: '1', label: 'coke' }, 
	                { value: '2', label: 'pepsi' }, 
	                { value: '3', label: 'rain water' } 
	            ]}
	        },	        
	
	        {type: 'select', attrs: {
	        	name: 'fav_band',
	            helpblock: 'I bet your favorite isn\'t listed.',
	            
	            label: 'What is your favorite band?',
	            options: [ 
	                {value: 'val1', label: 'The Wonder Years' }, 
	                {value: 'val2', label: 'Polar Bear Club' }, 
	                {value: 'val3', label: 'Frank Turner' } ] 
	            }
	        }

        ],

        buttons: [ 
			{   size: 'lg', 
			    validationState: 'success',  
			    label: 'Submit Form', 
			    onSubmit: function(form, values) { console.log(values); },
			    attrs:{
			    	type:'submit'
			    }
			},
			{   size: 'lg', 
			    validationState: 'danger',  
			    label: 'Erase Form',
			    onClick: function() { alert('hi'); }
			}
		]
};