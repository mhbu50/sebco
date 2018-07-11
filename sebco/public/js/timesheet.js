frappe.ui.form.on("Timesheet", {
  	setup: function(frm) {
  		frm.set_query("salary_component", "earning", function() {
  			return {
  				filters: {
  					type: "earning"
  				}
  			}
  		});
  		frm.set_query("salary_component", "deduction", function() {
  			return {
  				filters: {
  					type: "deduction"
  				}
  			}
  		})
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
   console.log("validate");


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
            // console.log("value.activity_type",value.activity_type);
            // console.log("row.activity_type", row.activity_type);
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

   $.each(frm.doc.earning, function(index, value) {
     frappe.model.set_value(value.doctype,value.name,"timesheet",frm.doc.name);
   });
   $.each(frm.doc.deduction, function(index, value) {
     frappe.model.set_value(value.doctype,value.name,"timesheet",frm.doc.name);
   });
 },
 overtime_hours:function(frm){
   frm.trigger("clc_overTime");
 },
 rate:function (frm) {
   console.log("3333");
  frm.trigger("clc_overTime");
 },
 clc_overTime:function(frm){

   frm.set_value("overtime_total",frm.doc.overtime_hours * frm.doc.rate);
   frm.refresh_fields("overtime_total");
 },
  absent_days:function(frm){
    frm.trigger("clc_absent");
  },
  absent_rate:function (frm) {

   frm.trigger("clc_absent");
  },
  clc_absent:function(frm){

    frm.set_value("absent_total",frm.doc.absent_days * frm.doc.absent_rate);
    frm.refresh_fields("absent_total");
  },

});
