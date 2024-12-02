import * as process from 'process';
import { ENVConfigs } from './config.enum';

export class ENVConfig {
  static get enableSwagger(): boolean {
    return this.getConfig(ENVConfigs.enableSwagger) === 'true';
  }

  static get port(): number {
    this.ensureConfigExistenceOrThrow(ENVConfigs.port);
    return +this.getConfig(ENVConfigs.port);
  }

  static get allowedRestOrigins(): string[] {
    this.ensureConfigExistenceOrThrow(ENVConfigs.allowedRestOrigins);
    return this.getConfig(ENVConfigs.allowedRestOrigins)
      .split(',')
      .map((i) => i.trim())
      .filter((i) => !!i && !!i.length);
  }

  static get acceptUnknownOrigins(): boolean {
    return this.getConfig(ENVConfigs.acceptUnknownOrigins) === 'true';
  }

  static get remoteApiKey(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.remoteApiKey);
    return this.getConfig(ENVConfigs.remoteApiKey);
  }

  static get JWTSecret(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.JWTSecret);
    return this.getConfig(ENVConfigs.JWTSecret);
  }

  static get dbName(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.dbName);
    return this.getConfig(ENVConfigs.dbName);
  }

  static get dbUrl(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.dbUrl);
    return this.getConfig(ENVConfigs.dbUrl);
  }

  static get testUsername(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.testUsername);
    return this.getConfig(ENVConfigs.testUsername);
  }

  static get testPassword(): string {
    this.ensureConfigExistenceOrThrow(ENVConfigs.testPassword);
    return this.getConfig(ENVConfigs.testPassword);
  }

  private static ensureConfigExistenceOrThrow(config: ENVConfigs): void {
    if (!process.env[config])
      throw new Error(`Missing env config "${config}". Please provide it`);
  }

  private static getConfig(config: ENVConfigs): string {
    return process.env[config];
  }
}
