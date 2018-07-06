frappe.ui.form.on("Timesheet", {
  setup:function(frm) {
  },
  onload: function(frm) {
    frm.set_value("project",frm.doc.customer);
    cur_frm.set_query("customer_po", function() {
       return {
           "filters": {
               "customer": frm.doc.customer
           }
       };
   });
 },
 validate: function(frm) {
   frappe.call({
     "method": "frappe.client.get",
     args: {
       doctype: "Customer PO",
       name: frm.doc.customer_po
     },
   		callback: function (data) {
   			console.log(data);
        frm.set_value("project",data.message.customer);
        data.message.activity_type.forEach(function(row){
          $.each(frm.doc.time_logs, function( index, value ) {
            console.log("value.activity_type",value.activity_type);
            console.log("row.activity_type", row.activity_type);
					if(value.activity_type == row.activity_type){
            value.billing_rate = row.billing_rate;
            value.costing_rate = row.costing_rate;
            value.billing_amount = row.billing_rate * value.hours;
            value.costing_amount = row.costing_rate * value.hours;
          }
				});
    		});
   		}
   });
 }
});
