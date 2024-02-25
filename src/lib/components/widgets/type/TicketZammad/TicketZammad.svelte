<script lang="ts">
	const ticket = {
		id: 361,
		group_id: 8,
		priority_id: 2,
		state_id: 1,
		organization_id: 4,
		number: '63339',
		title: 'Test 400',
		owner_id: 1,
		customer_id: 58,
		note: null,
		first_response_at: null,
		first_response_escalation_at: null,
		first_response_in_min: null,
		first_response_diff_in_min: null,
		close_at: null,
		close_escalation_at: null,
		close_in_min: null,
		close_diff_in_min: null,
		update_escalation_at: null,
		update_in_min: null,
		update_diff_in_min: null,
		last_close_at: null,
		last_contact_at: null,
		last_contact_agent_at: null,
		last_contact_customer_at: null,
		last_owner_update_at: null,
		create_article_type_id: 10,
		create_article_sender_id: 1,
		article_count: 1,
		escalation_at: null,
		pending_time: null,
		type: 'Incident',
		time_unit: null,
		preferences: {},
		updated_by_id: 1,
		created_by_id: 13,
		created_at: '2024-02-22T17:16:23.232Z',
		updated_at: '2024-02-22T22:02:54.178Z',
		service_catalog: 'Employee Support::Anonymous report',
		vendor: '',
		ticket_vendor: '',
		releated_applications: 'https://navigator.trocdigital.io/',
		hourstowork: null,
		overtimeapproval: null,
		pa_background_check_package: '',
		pa_brand_name: '',
		pa_existing_job_code: '',
		pa_job_needed_by: null,
		pa_existing_new_program: '',
		pa_name_badge_needed: '',
		pa_name_badge_selection: '',
		pa_company_code: '',
		pa_existing_department_code: '',
		pa_base_pay_minimum: null,
		pa_base_pay_maximum: null,
		pa_new_department_code: '',
		pa_positionrequire_p_card: '',
		pa_vendor_iden_needed: '',
		pa_vendor_iden_selection: '',
		pa_offer_letter_presented: [],
		following: 'On Hold',
		pa_existing_program_name: '',
		pa_new_program_name: '',
		pa_title_job: '',
		pa_job_family: '',
		pa_employment_type: [],
		pa_job_posting_type: [],
		pa_which_existing_job_code: '',
		pa_new_job_code: '',
		pa__what_existing_department_code: '',
		pa_vendor_needed: '',
		pa_traitify_given_to_candidate: '',
		bo_business_unit: '',
		bo_visit_iden: '',
		bo_address: '',
		bo_store_number: '',
		bo_city: '',
		bo_zip: null,
		bo_contact_affiliation: '',
		bo_initial_issue_description: '',
		bo_state: '',
		bo_country: 'US',
		bo_contact_type: '',
		bo_contact_name: '',
		bo_issue_category_classification: '',
		new_anonymous_category: '',
		bo_order_place: null,
		bo_bfsa_troubleshooting: '',
		bo_which_bose_display: '',
		bo_grid_part_1_order: '',
		bo_first_time_issue_resolution: '',
		bo_parts_needed: '',
		bo_grid_part_1_part: '',
		bo_date_shipped: null,
		bo_tracking: '',
		bo_grid_part_3_part: '',
		bo_grid_part_2_part: '',
		bo_grid_part_2_order: '',
		bo_grid_part_3_order: '',
		owner_fullname: null
	}
</script>

<div class="mx-auto p-4">
	<!-- <div
		class="mb-10 w-max rounded border-2 border-current p-3 text-lg font-bold uppercase leading-none"
	>
		{ticket.title}
	</div> -->

	<div class="mb-4 flex items-start border-b border-light-300 pb-4 dark:border-dark-200">
		<div class="flex-1">
			<span class="text-lg font-bold">{ticket.title}</span><br />
			<!-- <div class="mb-1 font-bold text-heading">Ticket #{ticket.number}</div> -->
			<div>{ticket.owner_id}</div>
			<div>{ticket.created_at}</div>
		</div>
		<div class="text-2xl font-bold text-heading">
			Ticket #{ticket.number}
		</div>
	</div>

	<table class=" table">
		<thead>
			<tr class="text-sm text-muted">
				<th class="6/12">Type</th>
				<th class="3/12 text-right">Following</th>
				<th class="3/12 text-right">State</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="4/12">{ticket.type}</td>
				<td class="3/12 text-right">{ticket.following}</td>
				<td class="3/12 text-right">{ticket.state_id}</td>
			</tr>
		</tbody>
	</table>

	<!-- <div class="mb-3 font-bold">Terms & Conditions</div>
	<div>
		Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam
		quis risus eget urna mollis ornare vel eu leo. Donec ullamcorper nulla non metus auctor
		fringilla. Donec sed odio dui.
	</div> -->
</div>
