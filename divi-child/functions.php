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
                wp_enqueue_script('divi_child_theme-scripts-dev', 'http://localhost:8080/site.js', array(), null, true);
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
add_action('wp_enqueue_scripts', 'divi_child_theme_scripts');

// Remove unwanted SVG filter injection WP
remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
