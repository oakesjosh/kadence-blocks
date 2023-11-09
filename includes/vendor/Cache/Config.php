<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Cache;

/**
 * Cache configuration.
 */
final class Config {

	/**
	 * The base server path to the uploads folder.
	 *
	 * @var string
	 */
	public $base_path;

	/**
	 * The base URL to the uploads folder.
	 *
	 * @var string
	 */
	public $base_url;

	public function __construct(
		string $base_path,
		string $base_url
	) {
		$this->base_path = $base_path;
		$this->base_url  = $base_url;
	}

}
