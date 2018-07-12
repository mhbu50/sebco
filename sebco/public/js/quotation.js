frappe.ui.form.on("Quotation", {
  refresh: function(frm) {
    frm.fields_dict['agreement'].get_query = function(doc) {
	return {
		filters: {
			"status": 'Active',
			"customer": frm.doc.customer
		}
	}
}

    $("div>ul>li>a:contains('Sales Order')").remove();
    $("div>ul>li>a:contains('Sales Order')").remove();
if (!frm.doc.__islocal && frm.doc.status !== "Lost" ) {
    frm.add_custom_button(__('Customer PO'), function() {
      frappe.route_options = {
        "agreement":frm.doc.agreement,
        "customer": frm.doc.customer,
        "quotation":frm.doc.name
      };
      frappe.new_doc("Customer PO");
        }, __("Make"));
      }
    }
});
