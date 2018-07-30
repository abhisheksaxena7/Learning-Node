import { flags } from '@oclif/command';
import { core, SfdxCommand } from '@salesforce/command';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('tdx', 'org');

export default class Org extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        coveragefile: flags.string({ char: 'f', description: messages.getMessage('nameFlagDescription') }),
    };

    this.org;
    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    public async run(): Promise < any > { // tslint:disable-line:no-any

    return { orgId: this.org.getOrgId(), outputString };
}
}
