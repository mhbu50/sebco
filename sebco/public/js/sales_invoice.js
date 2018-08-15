frappe.ui.form.on("Sales Invoice", {
  onload:function(frm){
    frm.toggle_enable("due_date", false);
    if(frm.doc.project){
      if(frm.doc.__islocal){
      frappe.call({
  			"method": "frappe.client.get",
        async: false,
  			args: {
  				doctype: "Agreement",
  				name: frm.doc.project
  			},
  			callback: function (data) {
  				if(data.message){
             var due_days = data.message.due_days;
             var after_add = frappe.datetime.add_days(frappe.datetime.nowdate(), due_days);
             console.log("due_days = "+ due_days + " after_add = "+ after_add);
             if(after_add){
               console.log("in after_add = ",after_add);
               frm.set_value("due_date",after_add);
               console.log("frm.doc.due_date = ",frm.doc.due_date);
               frm.refresh_field("due_date");
               frm.toggle_enable("due_date", false);
           }
  				}
  			}
  		});
    }
      cur_frm.get_field('sales_order').get_query = function(doc) {
        return {
            filters: [[
                'Sales Order', 'customer', '=',frm.doc.project,
            ],[
                'Sales Order', 'status', 'in',["To Deliver and Bill","To Bill","To Deliver"]
            ]]
        }
      }
    }
  },
  validate: function(frm){
    if (frm.doc.status == "Unpaid"){
      console.log();
    frappe.call({
			method: "erpnext.selling.doctype.sales_order.sales_order.update_status",
			args: {status: "To Deliver", name: frm.doc.sales_order},
			callback: function(r){
				frm.reload_doc();
			},
			always: function() {
				frappe.ui.form.is_saving = false;
			}
		});
  }
  if (frm.doc.status == "Paid"){
  frappe.call({
    method: "erpnext.selling.doctype.sales_order.sales_order.update_status",
    args: {status: "Completed", name: frm.doc.sales_order},
    callback: function(r){
      frm.reload_doc();
    },
    always: function() {
      frappe.ui.form.is_saving = false;
    }
  });
}
},
  project: function(frm){
    frm.doc.items = [];
    var new_row = frm.add_child("items");
                new_row.item_code = "Supplying Man Power";
                new_row.item_name = "Supplying Man Power";
                new_row.description = "Supplying Man Power";
                new_row.conversion_factor = "1";
                new_row.uom = "Nos";
                new_row.rate = frm.doc.total_billing_amount;
                new_row.amount = 1;
                new_row.qty = 1;
                new_row.income_account = "0100001 - Sales - warehouse 01 - S";
              refresh_field("items");
              frm.trigger("qty");
	}
});
