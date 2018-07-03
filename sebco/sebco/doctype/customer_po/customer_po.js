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
	}
});
