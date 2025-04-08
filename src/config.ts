import pkg from "../package.json" with { type: "json" };

/**
 * Main application configuration object.
 * Aggregates settings from environment variables and package.json.
 */
export const config = {
	/** The name of the MCP server, derived from package.json. */
	mcpServerName: pkg.name,
	/** The description of the MCP server, derived from package.json. */
	mcpServerDescription: pkg.description,
	/** The version of the MCP server, derived from package.json. */
	mcpServerVersion: pkg.version,
	/** Security-related configurations. */
	security: {
		// Placeholder for security settings
		/** Indicates if authentication is required for server operations. */
		authRequired: false,
	},
};
