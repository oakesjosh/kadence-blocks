import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import { headerBlockIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType('kadence/off-canvas', {
	...metadata,
	title: _x('Off Canvas', 'block title', 'kadence-blocks'),
	description: _x('Container for off canvas content.', 'block description', 'kadence-blocks'),
	icon: {
		src: headerBlockIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
