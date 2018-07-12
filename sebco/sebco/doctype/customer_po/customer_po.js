// Copyright (c) 2018, Accurate Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on('Customer PO', {
	refresh: function(frm) {
		frm.add_custom_button(__('Sales Order'), function() {
			if (frm.is_dirty()) {
				msgprint("Save before click");
			} else {
				var activity_type = frm.doc.activity_type;
				var discount = frm.doc.discount;
				frappe.model.with_doctype('Sales Order', function() {
					var doc = frappe.model.get_new_doc('Sales Order');
					doc.customer = frm.doc.customer;
					doc.customer_po = frm.doc.name;
					doc.date_po = frm.doc.date;
					$.each(activity_type, function(i, d) {
						var row = frappe.model.add_child(doc, "activity_type");
						row.activity_type = d.activity_type;
						row.billing_rate = d.billing_rate;
						row.costing_rate = d.costing_rate;
					});
					frappe.set_route('Form', doc.doctype, doc.name);
				});
			}
		});
	},
	onload:function(frm){
		// console.log("frm.doc",frm.doc);
		console.log("frm.doc.quotation ",frm.doc.quotation);
		if(frm.doc.__islocal && frm.doc.quotation){
		frappe.call({
			"method": "frappe.client.get",
			args: {
				doctype: "Quotation",
				name: frm.doc.quotation
			},
			callback: function (data) {
				if(data.message){
					console.log("data.message",data.message.items);
					data.message.items.forEach(function(row) {
						console.log("row = ",row);
						var new_row = frm.add_child("activity_type");
                new_row.activity_type = row.item_code;
                new_row.item_name = row.item_name;
                new_row.billing_rate = row.price_list_rate;
					});
					refresh_field("activity_type");
				}
			}
		});
	 }
	}
});
