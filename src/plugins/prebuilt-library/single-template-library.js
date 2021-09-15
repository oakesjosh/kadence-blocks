/**
 * External dependencies
 */
 import debounce from 'lodash/debounce';
 import LazyLoad from 'react-lazy-load';
 
 /**
  * WordPress dependencies
  */
  const {
	 applyFilters,
 } = wp.hooks;
 import {
	withSelect,
	withDispatch,
} from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { 
	Component,
	Fragment,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
 import {
	 Button,
	 ExternalLink,
	 Spinner,
 } from '@wordpress/components';
 import {
	arrowLeft,
	download,
	previous,
	update,
	next,
	chevronLeft,
	chevronDown,
} from '@wordpress/icons';
 import { __, sprintf } from '@wordpress/i18n';
 
 /**
  * Internal dependencies
  */
import KadenceTryParseJSON from '../../components/common/parse-json';

/**
 * Single Template Pages.
 */
class SingleTemplateLibrary extends Component {
	constructor() {
		super( ...arguments );
		this.loadTemplateData = this.loadTemplateData.bind( this );
		this.onInsertContent = this.onInsertContent.bind( this );
		this.importProcess = this.importProcess.bind( this );
		this.reloadTemplateData = this.reloadTemplateData.bind( this );
		this.state = {
			items: false,
			errorItems: false,
			isImporting: false,
			isLoading: false,
			sidebar:false,
		};
		this.debouncedReloadTemplateData = debounce( this.reloadTemplateData.bind( this ), 200 );
	}
	onInsertContent( blockcode ) {
		this.importProcess( blockcode );
	}
	importProcess( blockcode ) {
		this.setState( { isImporting: true } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_process_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'import_content', blockcode );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				control.props.import( response );
				control.setState( { isImporting: false } );
			}
		})
		.fail( function( error ) {
			console.log( error );
			control.setState( { isImporting: false } );
		});
	}
	reloadTemplateData() {
		this.setState( { errorItems: false, isLoading: true, items: 'loading' } );
		var data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_key ?  kadence_blocks_params.proData.api_key : '' );
		var data_email = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_email ?  kadence_blocks_params.proData.api_email : '' );
		if ( ! data_key ) {
			data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.ithemes_key ?  kadence_blocks_params.proData.ithemes_key : '' );
			if ( data_key ) {
				data_email = 'iThemes';
			}
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_reload_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'package', this.props.selectedSlug );
		data.append( 'url', this.props.selectedURL );
		data.append( 'is_template', 'is_template' );
		data.append( 'key', 'kadence-blocks' );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				const o = KadenceTryParseJSON( response, false );
				if ( o ) {
					control.setState( { items: o, errorItems: false, isLoading: false } );
				} else {
					control.setState( { items: 'error', errorItems: true, isLoading: false } );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			control.setState( { items: 'error', errorItems: true, isLoading: false } );
		});
	}
	loadTemplateData() {
		this.setState( { errorItems: false, isLoading: true, items: 'loading' } );
		var data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_key ?  kadence_blocks_params.proData.api_key : '' );
		var data_email = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_email ?  kadence_blocks_params.proData.api_email : '' );
		if ( ! data_key ) {
			data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.ithemes_key ?  kadence_blocks_params.proData.ithemes_key : '' );
			if ( data_key ) {
				data_email = 'iThemes';
			}
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'package', this.props.selectedSlug );
		data.append( 'url', this.props.selectedURL );
		data.append( 'is_template', 'is_template' );
		data.append( 'key', 'kadence-blocks' );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				const o = KadenceTryParseJSON( response, false );
				if ( o ) {
					control.setState( { items: o, errorItems: false, isLoading: false } );
				} else {
					control.setState( { items: 'error', errorItems: true, isLoading: false } );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			control.setState( { items: 'error', errorItems: true, isLoading: false } );
		});
	}
	render() {
		if ( this.props.reload ) {
			this.props.onReload();
			this.debouncedReloadTemplateData();
		}
		const control = this;
		const libraryItems = this.state.items;
		return (
			<div className={ `kt-prebuilt-content${ ( this.state.sidebar ? ' kb-prebuilt-has-sidebar' : '' ) }` }>
				<div className="kt-prebuilt-header kb-library-header">
					<div className="kb-library-header-left">
						<Button
							className={ 'kb-back-starter-templates' }
							icon={ arrowLeft }
							onClick={ () => this.props.onBack() }
						>
							{ __( 'Back to Starter Packs', 'kadence-blocks' ) }
						</Button>
					</div>
				</div>
				{ ( this.state.isImporting || this.state.isLoading || false === libraryItems || this.state.errorItems ) ? (
					<Fragment>
						{ ! this.state.errorItems && this.state.isLoading && (
							<Spinner />
						) }
						{ ! this.state.errorItems && this.state.isImporting &&  (
							<div className="preparing-importing-images">
								<Spinner />
								<h2>{ __( 'Preparing Content...', 'kadence-blocks' ) }</h2>
							</div>
						) }
						{ this.state.errorItems && (
							<Fragment>
								<h2 style={ { textAlign:'center' } }>
									{ __( 'Error, Unable to access library database, please try re-syncing', 'kadence-blocks' ) }
								</h2>
								<div style={ { textAlign:'center' } }>
									<Button 
										className="kt-reload-templates"
										icon={ update }
										onClick={ () => this.reloadTemplateData() }
									>
										{ __( ' Sync with Cloud', 'kadence-blocks' ) }
									</Button>
								</div>
							</Fragment>
						) }
						{ false === libraryItems && (
							<Fragment>{ this.loadTemplateData() }</Fragment>
						) }
					</Fragment>
				) : (
					<div
						className={ 'kb-prebuilt-grid kb-prebuilt-templates-grid kb-prebuilt-single-templates' }
					>
						{ Object.keys( this.state.items ).map( function( key, index ) {
							const name = libraryItems[key].name;
							const content = libraryItems[key].content;
							const image = libraryItems[key].image;
							// const imageWidth = libraryItems[key].imageW;
							// const imageHeight = libraryItems[key].imageH;
							const pro = libraryItems[key].pro;
							const locked = libraryItems[key].locked;
							//const imageSize = roundAccurately( ( imageHeight/imageWidth * 100), 2 );
							//const padding = ( imageSize < 126 ? imageSize : 126 )
							return (
								<div className="kt-prebuilt-item">
									<Button
										key={ key }
										className="kt-import-btn"
										isSmall
										aria-label={
											sprintf(
												/* translators: %s is Prebuilt Name */
												__( 'Add %s', 'kadence-blocks' ),
												name
											)
										}
										isDisabled={ undefined !== pro && pro && 'true' !== kadence_blocks_params.pro }
										onClick={ () => ! locked ? control.onInsertContent( content ) : '' }
									>
										<div
											className="kt-import-btn-inner kb-scroll-over-image"
											style={ {
												paddingBottom: '450px',
											} }
										>
											<LazyLoad>
												<img src={ image } alt={ name } />
											</LazyLoad>
											<div className="demo-title">
												<h4>{ name }</h4>
											</div>
										</div>
									</Button>
									{ undefined !== pro && pro && (
										<Fragment>
											<span className="kb-pro-template">{ __( 'Pro', 'kadence-blocks' ) }</span>
											{ locked && (
												<div className="kt-popover-pro-notice">
													<h2>{ __( 'Kadence Blocks Pro required for this item' ) } </h2>
													<ExternalLink href={ 'https://www.kadencewp.com/kadence-blocks/pro/' }>{ __( 'Upgrade to Pro', 'kadence-blocks' ) }</ExternalLink>
												</div>
											) }
										</Fragment>
									) }
								</div>
							);
						} ) }
					</div>
				) }
			</div>
		);
	}
}

export default compose(
	withSelect( ( select, { clientId } ) => {
		const { getBlock } = select( 'core/block-editor' );
		const { canUserUseUnfilteredHTML } = select( 'core/editor' );
		const block = getBlock( clientId );
		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML(),
		};
	} ),
	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML } ) => ( {
		import: ( blockcode ) => dispatch( 'core/block-editor' ).replaceBlocks(
			block.clientId,
			rawHandler( {
				HTML: blockcode,
				mode: 'BLOCKS',
				canUserUseUnfilteredHTML,
			} ),
		),
	} ) ),
)( SingleTemplateLibrary );
