steal(
	'mad/controller/componentController.js',
	'app/view/template/component/breadcrumb/breadcrumb.ejs',
	'app/view/template/component/breadcrumb/breadcrumbItem.ejs'
).then(function () {

	/*
	 * @class passbolt.controller.component.SettingsBreadcrumbController
	 * @inherits {mad.controller.ComponentController}
	 * @parent index
	 *
	 * The settings Breadcrumb will allow the user to know where he is.
	 *
	 * @constructor
	 * Instantiate the settings breadcrumb controller
	 *
	 * @param {HTMLElement} element the element this instance operates on.
	 * @param {Object} [options] option values for the controller.  These get added to
	 * this.options and merged with defaults static variable
	 * @return {passbolt.controller.component.SettingsBreadcrumbController}
	 */
	mad.controller.ComponentController.extend('passbolt.controller.component.SettingsBreadcrumbController', /** @static */ {

		'defaults': {
			// Template
			'templateUri': 'app/view/template/component/breadcrumb/breadcrumb.ejs',
			// Hidden by default
			'status': 'hidden',
			// The filter to display
			'filter': null
		}

	}, /** @prototype */ {

		/**
		 * Called right after the start function
		 * @return {void}
		 * @see {mad.controller.ComponentController}
		 */
		'afterStart': function () {
			// Create and render menu in the created container.
			var menuSelector = '#' + this.getId() + ' ul';
			this.options.menu = new mad.controller.component.MenuController(
				menuSelector,
				{
					'itemTemplateUri': 'app/view/template/component/breadcrumb/breadcrumbItem.ejs'
				}
			);
			this.options.menu.start();

			// Store menu items in an array.
			// This contains the static part of the menu.
			this.menuItems = [];
			// Contains the specific section menu items.
			this.sectionMenuItems = [];

			// First 2 items of the menu are constant.
			var menuItem = new mad.model.Action({
				'id': uuid(),
				'label': __('All users'),
				'action': function () {
					// Add a link to filter on all items as first item.
					var filter = new passbolt.model.Filter({
						'label': __('All users'),
						'type': passbolt.model.Filter.SHORTCUT
					});
					// Switch to people workspace.
					mad.bus.trigger('workspace_selected', 'people');
					// Set filter.
					mad.bus.trigger('filter_users_browser', filter);
				}
			});
			this.menuItems.push(menuItem);

			var menuItem = new mad.model.Action({
				'id': uuid(),
				'label': passbolt.model.User.getCurrent().Profile.first_name + ' ' + passbolt.model.User.getCurrent().Profile.last_name,
				'action': function () {
					// Switch to people workspace.
					mad.bus.trigger('request_settings_section', 'profile');
				}
			});
			this.menuItems.push(menuItem);

			// Specific menu items, per section.
			// profile section.
			this.sectionMenuItems['profile'] = [
				new mad.model.Action({
					'id': uuid(),
					'label': __('Profile'),
					'action': function () {
						return;
					}
				})
			];
			// keys section.
			this.sectionMenuItems['keys'] = [
				new mad.model.Action({
					'id': uuid(),
					'label': __('Keys management'),
					'action': function () {
						return;
					}
				})
			];
		},

		/**
		 * Load the current filter
		 */
		'load': function () {
			// To use if we need to load something.
			// Do not remove, it breaks the code.
		},

		/**
		 * Destroy the workspace.
		 */
		'destroy': function() {
			// Be sure that the primary workspace menu controller will be destroyed also.
			$('#' + this.getId() + ' ul').empty();
			this._super();
		},

		/**
		 * Refresh the menu items as per the section.
		 * @param section
		 */
		'refreshMenuItems': function(section) {
			// The items of the menu are a combination of static items and section dynamic items.
			// If the section is recognised, we just assemble the 2 arrays. Otherwise, we just keep the static part.
			var menuItems = (this.sectionMenuItems[section] !== undefined) ?
				$.merge($.merge([], this.menuItems), this.sectionMenuItems[section]) : this.menuItems;
			// Reset the menu.
			this.options.menu.reset();
			// Load the items.
			this.options.menu.load(menuItems);
		},

		/* ************************************************************** */
		/* LISTEN TO THE APP EVENTS */
		/* ************************************************************** */

		/**
		 * Listen to request_settings_section event.
		 * @param el
		 * @param ev
		 * @param section
		 */
		'{mad.bus} request_settings_section': function (el, ev, section) {
			// @todo #PASSBOLT-985 fixed in future canJs.
			if (!this.element) return;
			// When the section changes, we refresh the menu items in the breadcrumb.
			this.refreshMenuItems(section);
		}

	});
});