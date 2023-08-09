/**
 * External dependencies
 */

/**
 * Wordpress dependencies
 */
import { forwardRef, useRef, useState, useEffect } from '@wordpress/element';
import { Popover } from '@wordpress/components';
import { Icon, chevronDown } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './advanced-select.scss';
import { Button } from '../button';
import { AdvancedSelectMenu } from './advanced-select-menu';

export const AdvancedSelect = forwardRef(function AdvancedSelect( props, ref ) {
	const { value, label, options, onChange, createRecord, updateRecord, deleteRecord } = props;
	const [componentWidth, setComponentWidth] = useState('auto');
	const [isOpen, setIsOpen] = useState(false);
	const [allowClose, setAllowClose] = useState(true);
	let parentRef = useRef();

	useEffect(() => {
		if(parentRef && parentRef.current) {
			/* Subtracting 16 for the padding in the parent */
			setComponentWidth(`${parentRef.current.clientWidth - 16}px`);
		}
	}, [parentRef]);

	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		}
	}, [allowClose]);

	function handleOutsideClick(event) {
		event.stopPropagation();
		if (parentRef && !parentRef.current.contains(event.target)) {
			shouldClose();
		}
	}

	function shouldClose() {
		if(allowClose) {
			setIsOpen(false);
		}
	}

	function doNothing() {/* Override the WP component defaults */}

    return (
		<div className="stellarwp components-advanced-select" ref={ ref }>
			{label && <label class="components-input-control__label">{ label }</label>}

				<div className="stellarwp-advancedSelect" ref={parentRef}>
					<Button
						className={`${isOpen ? 'is-open' : ''}`}
						onClick={ () => setIsOpen(!isOpen) }
					>
						<div className="stellarwp-advancedSelect__button-content">
							<div className="stellarwp-advancedSelect__button-label">{ value.label }</div>
							<div className="stellarwp-advancedSelect__button-icon"><Icon size={25} icon={chevronDown} /></div>
						</div>

						{isOpen && (
							<Popover
								placement="bottom-start"
								offset={8}
								animate={false}
								style={{
									maxHeight: '500px'
								}}
								className="stellarwp-advancedSelect__content"
								onClose={ doNothing }
								onFocusOutside={ doNothing }
							>
								<AdvancedSelectMenu
									width={ componentWidth }
									options={ options }
									onSelect={ onChange }
									value={ value.value }
									allowClose={ setAllowClose }
									createRecord={ createRecord }
									updateRecord={ updateRecord }
									deleteRecord={ deleteRecord }
								/>
							</Popover>
						)}
					</Button>
				</div>
		</div>
    )
  }
)

