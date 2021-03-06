<?php

// Block direct access to file
defined( 'ABSPATH' ) or die( 'Not Authorized!' );

/**
  * <%= childClassName %>_Submenu_Page
  *
  * @since <%= projectVersion %>
  *
  * @author <%= projectAuthor %>
  * @license <%= projectLicense %>
  *
  */
class <%= childClassName %>_Submenu_Page {

  function __construct() {

    add_submenu_page(
      "<%= parent_slug %>",
      __("<%= page_title %>", "<%= projectName %>"),
      __("<%= menu_title %>", "<%= projectName %>"),
      "<%= capability %>",
      "<%= menu_slug %>",
      array($this, "print_page")
    );

  }

  public function print_page() {
    ob_start(); ?>

    <div class="wrap">

      <div class="card">
        <h1><?php _e( '<%= menu_title %>', '<%= projectName %>' ); ?></h1>
        <p><?php _e( 'This is the <%= menu_title %> sub menu page start here to customize your template.', '<%= projectName %>' ); ?></p>
      </div>

    </div><?php

    return print(ob_get_clean());
  }

}
