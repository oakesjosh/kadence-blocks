/**
 * BLOCK: Kadence Block Template
 */

/**
 * Import Css
 */
import './editor.scss'

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control'

const { InspectorControls } = wp.blockEditor


import { createElement } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor';
import uniqueId from 'lodash/uniqueId'

const { PanelBody, ToggleControl } = wp.components

/**
 * Internal dependencies
 */
import { Fragment } from 'react';

const ktShowMoreUniqueIDs = []

export function Edit ({
	attributes,
	setAttributes,
	clientId,
  	previewDevice
} ) {

	const {
		uniqueID,
		showHideMore,
		defaultExpandedMobile,
		defaultExpandedTablet,
		defaultExpandedDesktop,
		marginDesktop,
		marginTablet,
		marginMobile,
		marginUnit,
		paddingDesktop,
		paddingTablet,
		paddingMobile,
		paddingUnit,
	} = attributes

	if (!uniqueID) {
		const blockConfigObject = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [])
		if (blockConfigObject['kadence/show-more'] !== undefined && typeof blockConfigObject['kadence/show-more'] === 'object') {
			Object.keys(blockConfigObject['kadence/show-more']).map((attribute) => {
				uniqueID = blockConfigObject['kadence/show-more'][attribute]
			})
		}
		setAttributes({
			uniqueID: '_' + clientId.substr(2, 9),
		})
		ktShowMoreUniqueIDs.push('_' + clientId.substr(2, 9))
	} else if (ktShowMoreUniqueIDs.includes(uniqueID)) {
		setAttributes({
			uniqueID: '_' + clientId.substr(2, 9),
		})
		ktShowMoreUniqueIDs.push('_' + clientId.substr(2, 9))
	} else {
		ktShowMoreUniqueIDs.push(uniqueID)
	}

	const [ marginControl, setMarginControl ] = useState( 'individual');
	const [ paddingControl, setPaddingControl ] = useState( 'individual');

	const getPreviewSize = ( device, desktopSize, tabletSize, mobileSize ) => {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}

	const childBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId );

	const buttonOneUniqueID = childBlocks[1] ? childBlocks[1].substr( 2, 9 ) : uniqueId('button-one-');
	const buttonTwoUniqueID = childBlocks[3] ? childBlocks[3].substr( 2, 9 ) : uniqueId('button-two-');

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[0] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[1] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[2] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[3] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[0] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[1] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[2] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[3] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );



	console.log('previewMarginLeft', previewMarginLeft);

	console.log('marginDesktop', marginDesktop);
	console.log('marginTablet', marginTablet);
	console.log('marginMobile', marginMobile);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __('Show More Settings', 'kadence-blocks') }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Display "Hide" button once expanded', 'kadence-blocks' ) }
						checked={ showHideMore }
						onChange={ ( value ) => setAttributes( { showHideMore: value } ) }
					/>
				</PanelBody>
				<PanelBody
					title={ __('Spacing Settings', 'kadence-blocks') }
					initialOpen={ false }
				>
					<ResponsiveMeasurementControls
						label={ __( 'Padding', 'kadence-blocks' ) }
						value={ [ previewPaddingTop, previewPaddingRight, previewPaddingBottom, previewPaddingLeft ] }
						control={ paddingControl }
						tabletValue={ paddingTablet }
						mobileValue={ paddingMobile }
						onChange={ ( value ) => setAttributes( { paddingDesktop: value } ) }
						onChangeTablet={ ( value ) => setAttributes( { paddingTablet: value } ) }
						onChangeMobile={ ( value ) => setAttributes( { paddingMobile: value } ) }
						onChangeControl={ ( value ) => setPaddingControl( value ) }
						min={ 0 }
						max={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200 ) }
						step={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1 ) }
						unit={ paddingUnit }
						units={ [ 'px', 'em', 'rem', '%' ] }
						onUnit={ ( value ) => setAttributes( { paddingUnit: value } ) }
					/>
					<ResponsiveMeasurementControls
						label={ __( 'Margin', 'kadence-blocks' ) }
						value={ [ previewMarginTop, previewMarginRight, previewMarginBottom, previewMarginLeft ] }
						control={ marginControl }
						tabletValue={ marginTablet }
						mobileValue={ marginMobile }
						onChange={ ( value ) => {
							console.log('test', value);
							setAttributes( { marginDesktop: value } );
						} }
						onChangeTablet={ ( value ) => setAttributes( { marginTablet: value } ) }
						onChangeMobile={ ( value ) => setAttributes( { marginMobile: value } ) }
						onChangeControl={ ( value ) => setMarginControl( value ) }
						min={ ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 ) }
						max={ ( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 ) }
						step={ ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 ) }
						unit={ marginUnit }
						units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
						onUnit={ ( value ) => setAttributes( { marginUnit: value } ) }
					/>
				</PanelBody>
				<PanelBody
					title={ __('Expand Settings', 'kadence-blocks') }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Default Expanded on Desktop', 'kadence-blocks' ) }
						checked={ defaultExpandedDesktop }
						onChange={ ( value ) => setAttributes( { defaultExpandedDesktop: value } ) }
					/>
					<ToggleControl
						label={ __( 'Default Expanded on Tablet', 'kadence-blocks' ) }
						checked={ defaultExpandedTablet }
						onChange={ ( value ) => setAttributes( { defaultExpandedTablet: value } ) }
					/>
					<ToggleControl
						label={ __( 'Default Expanded on Mobile', 'kadence-blocks' ) }
						checked={ defaultExpandedMobile }
						onChange={ ( value ) => setAttributes( { defaultExpandedMobile: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div style={ {
				marginTop: ( '' !== previewMarginTop ? previewMarginTop + marginUnit : undefined ),
				marginRight: ( '' !== previewMarginRight ? previewMarginRight + marginUnit : undefined ),
				marginBottom: ( '' !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined ),
				marginLeft: ( '' !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined ),

				paddingTop: ( '' !== previewPaddingTop ? previewPaddingTop + paddingUnit : undefined ),
				paddingRight: ( '' !== previewPaddingRight ? previewPaddingRight + paddingUnit : undefined ),
				paddingBottom: ( '' !== previewPaddingBottom ? previewPaddingBottom + paddingUnit : undefined ),
				paddingLeft: ( '' !== previewPaddingLeft ? previewPaddingLeft + paddingUnit : undefined ),
			} }>
				{ createElement(InnerBlocks, {
					template: [
						['core/group', {
							lock: {
								remove: true,
								move: true
							},
							className: 'kt-show-more-preview',
						}, { innerBlocks: ['core/paragraph', { placeholder: __('Add new content to this group blocks to customize your page', 'kadence-blocks') }] }],
						['kadence/advancedbtn', {
							lock: { remove: true, move: true },
							hAlign: 'left',
							thAlign: "",
							mhAlign: "",
							btnCount: 1,
							uniqueID: buttonOneUniqueID,
							className: 'kt-show-more-button',
							btns: [
								{
									'text': 'Show More',
									'link': '',
									'target': '_self',
									'size': '',
									'paddingBT': '',
									'paddingLR': '',
									'color': '',
									'background': '',
									'border': '',
									'backgroundOpacity': 1,
									'borderOpacity': 1,
									'borderRadius': '',
									'borderWidth': '',
									'colorHover': '',
									'backgroundHover': '',
									'borderHover': '',
									'backgroundHoverOpacity': 1,
									'borderHoverOpacity': 1,
									'icon': '',
									'iconSide': 'right',
									'iconHover': false,
									'cssClass': '',
									'noFollow': false,
									'gap': 5,
									'responsiveSize': [
										'',
										''
									],
									'gradient': [
										'#999999',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'gradientHover': [
										'#777777',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'btnStyle': 'basic',
									'btnSize': 'small',
									'backgroundType': 'solid',
									'backgroundHoverType': 'solid',
									'width': [
										'',
										'',
										''
									],
									'responsivePaddingBT': [
										'',
										''
									],
									'responsivePaddingLR': [
										'',
										''
									],
									'boxShadow': [
										true,
										'#000000',
										0.2,
										1,
										1,
										2,
										0,
										false
									],
									'boxShadowHover': [
										true,
										'#000000',
										0.4,
										2,
										2,
										3,
										0,
										false
									],
									'inheritStyles': 'inherit',
									'borderStyle': '',
									'onlyIcon': [
										false,
										'',
										''
									]
								}
							],
							"typography": "",
							"googleFont": false,
							"loadGoogleFont": true,
							"fontSubset": "",
							"fontVariant": "",
							"fontWeight": "regular",
							"fontStyle": "normal",
							"textTransform": "",
							"widthType": "auto",
							"widthUnit": "px",
							"forceFullwidth": false,
							"collapseFullwidth": false,
							"margin": [
								{
									"desk": [
										"",
										"",
										"",
										""
									],
									"tablet": [
										"",
										"",
										"",
										""
									],
									"mobile": [
										"",
										"",
										"",
										""
									]
								}
							],
							"marginUnit": "px",
							"inQueryBlock": false,
							"kadenceAOSOptions": [
								{
									"duration": "",
									"offset": "",
									"easing": "",
									"once": "",
									"delay": "",
									"delayOffset": ""
								}
							]
						}],
						['core/group', {
							lock: {
								remove: true,
								move: true
							},
							className: 'kt-show-more-expanded',
						}, { innerBlocks: ['core/paragraph', { placeholder:  __('This group block is initially hidden. Content here will replace the top content when expanded.', 'kadence-blocks') }] }],
						['kadence/advancedbtn', {
							lock: { remove: true, move: true },
							hAlign: 'left',
							uniqueID: buttonTwoUniqueID,
							className: 'kt-hide-more-button',
							btns: [
								{
									'text': 'Show Less',
									'link': '',
									'target': '_self',
									'size': '',
									'paddingBT': '',
									'paddingLR': '',
									'color': '',
									'background': '',
									'border': '',
									'backgroundOpacity': 1,
									'borderOpacity': 1,
									'borderRadius': '',
									'borderWidth': '',
									'colorHover': '',
									'backgroundHover': '',
									'borderHover': '',
									'backgroundHoverOpacity': 1,
									'borderHoverOpacity': 1,
									'icon': '',
									'iconSide': 'right',
									'iconHover': false,
									'cssClass': '',
									'noFollow': false,
									'gap': 5,
									'responsiveSize': [
										'',
										''
									],
									'gradient': [
										'#999999',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'gradientHover': [
										'#777777',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'btnStyle': 'basic',
									'btnSize': 'small',
									'backgroundType': 'solid',
									'backgroundHoverType': 'solid',
									'width': [
										'',
										'',
										''
									],
									'responsivePaddingBT': [
										'',
										''
									],
									'responsivePaddingLR': [
										'',
										''
									],
									'boxShadow': [
										true,
										'#000000',
										0.2,
										1,
										1,
										2,
										0,
										false
									],
									'boxShadowHover': [
										true,
										'#000000',
										0.4,
										2,
										2,
										3,
										0,
										false
									],
									'inheritStyles': 'inherit',
									'borderStyle': '',
									'onlyIcon': [
										false,
										'',
										''
									]
								}
							],
							"typography": "",
							"googleFont": false,
							"loadGoogleFont": true,
							"fontSubset": "",
							"fontVariant": "",
							"fontWeight": "regular",
							"fontStyle": "normal",
							"textTransform": "",
							"widthType": "auto",
							"widthUnit": "px",
							"forceFullwidth": false,
							"collapseFullwidth": false,
							"margin": [
								{
									"desk": [
										"",
										"",
										"",
										""
									],
									"tablet": [
										"",
										"",
										"",
										""
									],
									"mobile": [
										"",
										"",
										"",
										""
									]
								}
							],
							"marginUnit": "px",
							"inQueryBlock": false,
							"kadenceAOSOptions": [
								{
									"duration": "",
									"offset": "",
									"easing": "",
									"once": "",
									"delay": "",
									"delayOffset": ""
								}
							]
						}]
					],
				}) }
			</div>
		</Fragment>
	)

}

export default compose( [
	withSelect( ( select ) => {
		return {
			previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			getUniqueIDs: select( 'kadenceblocks/data' ).getUniqueIDs(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		addUniqueID: ( value ) => dispatch( 'kadenceblocks/data' ).addUniqueID( value ),
	} ) ),
] )( Edit );
