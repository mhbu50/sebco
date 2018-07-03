frappe.ui.form.on("Sales Order", {
	onload: function(frm) {
    console.log("in Sales Order");
    if(frm.doc.items && frm.doc.__islocal){
      $.each(frm.doc.items, function(index, value) {
          var new_row = frm.add_child("activity_type");
          new_row.activity_type = value.item_name;
          new_row.billing_rate = value.rate;
      });
      refresh_field("activity_type");
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
			});
			refresh_field("activity_type");
		}
	});
}
	}
});
