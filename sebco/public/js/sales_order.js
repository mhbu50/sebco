frappe.ui.form.on("Sales Order", {
	onload: function(frm) {
    console.log("in Sales Order");
    if(frm.doc.items && frm.doc.__islocal){
      $.each(frm.doc.items, function(index, value) {
          var new_row = frm.add_child("activity_type");
          new_row.activity_type = value.item_name;
          new_row.billing_rate = value.rate;
					new_row.costing_rate = value.rate;
      });
      refresh_field("activity_type");
    }

		if(frm.doc.customer && frm.doc.__islocal){
			frm.set_value("project",frm.doc.customer);
			frm.refresh_field("project");
      frappe.call({
  			"method": "frappe.client.get",
  			args: {
  				doctype: "Agreement",
  				name: frm.doc.agreement
  			},
  			callback: function (data) {
  				if(data.message){
             var due_days = data.message.due_days;
             var after_add = frappe.datetime.add_days(frappe.datetime.nowdate(), due_days);
             console.log("due_days = "+ after_add + " after_add = "+ after_add);
             frm.set_value("delivery_date",after_add);
             frm.refresh_field("delivery_date");
             frm.toggle_enable("delivery_date", false);

  				}
  			}
  		});
    }

		if(frm.doc.__islocal && cur_frm.get_field("items").grid.grid_rows.length > 0){
		cur_frm.get_field("items").grid.grid_rows[0].remove();
 		}
		if(frm.doc.__islocal){
		var new_row = frm.add_child("items");
                new_row.item_code = "Supplying Man Power";
                new_row.item_name = "Supplying Man Power";
                new_row.description = "Supplying Man Power";
                new_row.conversion_factor = "1";
                new_row.uom = "Nos";
                new_row.rate = frm.doc.total_billing_amount;
                new_row.amount = 1;
                new_row.qty = 1;
                // new_row.income_account = "0100001 - Sales - warehouse 01 - S";
              refresh_field("items");
              frm.trigger("qty");
					}
	},
	customer_po:function(frm){
		console.log("frm.doc.customer_po",frm.doc.customer_po);
		if (frm.doc.customer_po){
	frm.doc.activity_type = [];
		frappe.call({
		"method": "frappe.client.get",
		args: {
				doctype: "Customer PO",
				name: frm.doc.customer_po
		},
		callback: function (data) {
			console.log("data",data);
			$.each(data.message.activity_type, function(index, value) {
					var new_row = frm.add_child("activity_type");
					new_row.activity_type = value.activity_type;
					new_row.billing_rate = value.billing_rate;
					new_row.costing_rate = value.costing_rate;
			});
			refresh_field("activity_type");
		}
	});
}
	}
});
