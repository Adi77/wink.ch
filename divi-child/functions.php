<?php

function my_theme_enqueue_styles()
{
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_styles');




/**
 * Enqueue scripts and styles.
 */
function divi_child_theme_scripts()
{
    switch (wp_get_environment_type()) {
        case 'local':
        case 'development':
            // load assets (dev)
            // Prevent loading css for global templates editing in backend
            $current_url = home_url(add_query_arg(null, null));
            if (strpos($current_url, '/et_header_layout/') === false) {
                wp_enqueue_script('divi_child_theme-scripts-dev', 'http://'. getenv('VIRTUAL_HOST'). ':8080/site.js', array(), null, true);
                //wp_enqueue_script('divi_child_theme-admin-scripts-dev', 'http://localhost:8080/admin.js');
            }
            
          break;
        case 'staging':
            // load assets (staging)
            wp_enqueue_style('divi_child_theme-style', get_stylesheet_directory_uri() . '/dist/site.css');
            wp_enqueue_script('divi_child_theme-scripts', get_stylesheet_directory_uri() . '/dist/site.js', array(), null, true);
            //wp_enqueue_script('divi_child_theme-admin-scripts', get_stylesheet_directory_uri() . '/dist/admin.js');
          break;
        case 'production':
        default:
            // load assets (prod)
            wp_enqueue_style('divi_child_theme-style', get_stylesheet_directory_uri() . '/dist/site.css');
            wp_enqueue_script('divi_child_theme-scripts', get_stylesheet_directory_uri() . '/dist/site.js', array(), null, true);
            //wp_enqueue_script('divi_child_theme-admin-scripts', get_stylesheet_directory_uri() . '/dist/admin.js');
          break;
      }
}
add_action('wp_enqueue_scripts', 'divi_child_theme_scripts', 9999);


// Remove unwanted SVG filter injection WP
remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');


add_action('wp_enqueue_scripts', 'crunchify_disable_unused_loading_css_js', 9999);
 
function crunchify_disable_unused_loading_css_js()
{
  
    // Check if it's any of WooCommerce page
    if (get_the_slug() != 'blog') {
      
      ## Dequeue divi blog extras styles
        wp_dequeue_style('divi-blog-extras-styles');
 
        ## Dequeue divi blog extras scripts
        wp_dequeue_script('divi-blog-extras-frontend-bundle');
    }
}


function get_the_slug()
{
    global $post;
    $slug = $post->post_name ?? '';



    if (! $slug) {
        $slug = basename(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH));
    }

    return $slug;
}

//echo get_the_slug();


// remove commas between category tags on single blog page
if (! function_exists('et_pb_postinfo_meta')) :
    /**
     * Return post meta.
     *
     * @param string[] $postinfo post info e.g date, author, categories.
     * @param string   $date_format date format.
     * @param string   $comment_zero text to display for 0 comments.
     * @param string   $comment_one text to display for 1 comments.
     * @param string   $comment_more text to display for more comments.
     */
    function et_pb_postinfo_meta($postinfo, $date_format, $comment_zero, $comment_one, $comment_more)
    {
        $postinfo_meta = array();

        if (in_array('author', $postinfo, true)) {
            $postinfo_meta[] = ' ' . esc_html__('by', 'et_builder') . ' <span class="author vcard">' . et_pb_get_the_author_posts_link() . '</span>';
        }

        if (in_array('date', $postinfo, true)) {
            $postinfo_meta[] = '<span class="published">' . esc_html(get_the_time($date_format)) . '</span>';
        }

        if (in_array('categories', $postinfo, true)) {
            $categories_list = get_the_category_list(' ');
            // do not output anything if no categories retrieved.
            if ('' !== $categories_list) {
                $postinfo_meta[] = $categories_list;
            }
        }

        if (in_array('comments', $postinfo, true)) {
            $postinfo_meta[] = et_pb_get_comments_popup_link($comment_zero, $comment_one, $comment_more);
        }

        return implode(' | ', array_filter($postinfo_meta));
    }
endif;



/* custom .mo files in divi_child
function my_lang_function()
{
    load_child_theme_textdomain('Divi', get_stylesheet_directory() . '/lang');
    load_child_theme_textdomain('et_builder', get_stylesheet_directory() . '/includes/builder/languages');
}
    add_action('after_setup_theme', 'my_lang_function');
 */


/* generate pdf on contact form 7 submit - test */
 add_filter('wpcf7_mail_components', 'custom_wpcf7_mail_components');
    function custom_wpcf7_mail_components($components)
    {
        require_once('tcpdf/tcpdf_cf7.php');
        //Get current form
        $wpcf7 = WPCF7_ContactForm::get_current();
        $attachment_file_path = '';
        //check the relevant form id
        if ($wpcf7->id == '247784') {
            // get current SUBMISSION instance
            $submission = WPCF7_Submission::get_instance();
            if ($submission) {
                // get submission data
                $data = $submission->get_posted_data();
                $name = $data['gutschein-text'];


                $lektion = $data['lektion'][0];




                // create new PDF document
                $createpdf = new CREATE_FPDFCF7();
                // setup upload directory
                $upload_dir = wp_upload_dir();
                define('PDF_FILE_PATH', $upload_dir['basedir'].'/cf7_pdf/');
                $fname = $createpdf->CREATE_FPDFCF7Fn($name, $lektion, PDF_FILE_PATH);
                //set filenames
                $pdf_filename= PDF_FILE_PATH.$fname;



                //set attachment full path
                $attachment_file_path = $pdf_filename;
                //append new file to mail attachments


                $components['attachments'][] = $attachment_file_path;
                $components['attachments'][] = 'uploads/2022/05/Gutschein_A4_ES.pdf';
            }
        }
        return $components;
    }
