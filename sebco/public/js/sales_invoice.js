frappe.ui.form.on("Sales Invoice", {
  onload:function(frm){
    if(frm.doc.project){
      frappe.call({
  			"method": "frappe.client.get",
  			args: {
  				doctype: "Agreement",
  				name: frm.doc.project
  			},
  			callback: function (data) {
  				if(data.message){
             var due_days = data.message.due_days;
             var after_add = frappe.datetime.add_days(frappe.datetime.nowdate(), due_days);
             console.log("due_days = "+ after_add + " after_add = "+ after_add);
             frappe.set_value("due_date",after_add);
             frm.refresh_field("due_date");

  				}
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
