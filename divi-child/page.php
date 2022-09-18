<?php

get_header();

$is_page_builder_used = et_pb_is_pagebuilder_used(get_the_ID());

?>

<div id="main-content">

	<?php if (! $is_page_builder_used) : ?>

	<div class="container">
		<div id="content-area" class="clearfix">

			<?php endif; ?>

			<?php while (have_posts()) : the_post(); ?>

			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

				<?php if (! $is_page_builder_used) : ?>

				<h1 class="entry-title main_title"><?php the_title(); ?>
				</h1>
				<?php
                    $thumb = '';

                    $width = (int) apply_filters('et_pb_index_blog_image_width', 1080);

                    $height = (int) apply_filters('et_pb_index_blog_image_height', 675);
                    $classtext = 'et_featured_image';
                    $titletext = get_the_title();
                    $alttext = get_post_meta(get_post_thumbnail_id(), '_wp_attachment_image_alt', true);
                    $thumbnail = get_thumbnail($width, $height, $classtext, $alttext, $titletext, false, 'Blogimage');
                    $thumb = $thumbnail["thumb"];

                    if ('on' === et_get_option('divi_page_thumbnails', 'false') && '' !== $thumb) {
                        print_thumbnail($thumb, $thumbnail["use_timthumb"], $alttext, $width, $height);
                    }
                ?>

				<?php endif; ?>

				<div class="entry-content">
					<?php
                        the_content();

                        if (! $is_page_builder_used) {
                            wp_link_pages(array( 'before' => '<div class="page-links">' . esc_html__('Pages:', 'Divi'), 'after' => '</div>' ));
                        }
                    ?>
				</div> <!-- .entry-content -->

				<?php
                    if (! $is_page_builder_used && comments_open() && 'on' === et_get_option('divi_show_pagescomments', 'false')) {
                        comments_template('', true);
                    }
                ?>

			</article> <!-- .et_pb_post -->

			<?php endwhile; ?>

			<?php if (! $is_page_builder_used) : ?>



			<?php get_sidebar(); ?>
		</div> <!-- #content-area -->
	</div> <!-- .container -->

	<?php endif; ?>
	<span class="dark-mode-switch">
		<a href="#" alt="dark mode switch">
			<svg id="dark-mode-toggle" data-name="Dark mode toggle" xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 29.95 29.95">
				<path
					d="M300.58,436.87a15,15,0,1,1,14.9-15A15,15,0,0,1,300.58,436.87Zm0-2.13V409a12.85,12.85,0,1,0,0,25.7Z"
					transform="translate(-285.52 -406.91)" />
			</svg>
		</a>
	</span>
	<!-- <span id="cursor-shadow" class="cursor-shadow"></span>
	<div id="loader"></div> -->
</div> <!-- #main-content -->

<?php

get_footer();
