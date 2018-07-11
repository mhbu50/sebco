frappe.ui.form.on('Payroll Entry', {
	refresh: function(frm) {
		console.log("frm.doc",frm.doc);
		if(frm.doc.docstatus == 1){
    frm.add_custom_button(__("Calculate Overtime/Absent"),
      function() {
				frappe.call({
						"method": "sebco.sebco.tools.add_overtime_to_salaryslip",
				args: {
					posting_date: frm.doc.posting_date,
					start:frm.doc.start_date,
					end:frm.doc.end_date
						} ,
						callback: function (data) {
							console.log(data);
						}
				});
      }
    );
	}
	}
});
