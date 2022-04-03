/**
 * The sole purpose of this boot file is to shim the reflect-metadata.
 * Using reflect-metadata was necessary because of our use of class-transformers.
 * Reference: {@link https://github.com/typestack/class-transformer#browser}
 */
import 'reflect-metadata'
