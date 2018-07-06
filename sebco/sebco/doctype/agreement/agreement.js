// Copyright (c) 2018, Accurate Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on('Agreement', {
	refresh: function(frm) {
		if (!frm.doc.__islocal ) {
		    frm.add_custom_button(__('Quotation'), function() {
		      frappe.route_options = {
		        "agreement": frm.doc.name,
		        "customer": frm.doc.customer,
						"project": frm.doc.customer
		      };
		      frappe.new_doc("Quotation");
		        }, __("Make"));
		      }

	}
});
