import * as THREE from 'three';

/**
 * Convert an ambientHue.js palette anchor ({ r, g, b } in 0..1) to a
 * THREE.Color via setRGB — authored-value passthrough, deliberately NOT the
 * hex constructor, which would round-trip through sRGB ColorManagement.
 *
 * Shared by createLiveProofScene and createHeroScene (ADR-0004) so the
 * palette → uniform conversion has one home.
 */
export const toThreeColor = ({ r, g, b }) => new THREE.Color().setRGB(r, g, b);
