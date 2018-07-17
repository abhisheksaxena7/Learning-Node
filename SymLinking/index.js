const fs = require('fs-extra');
const path = require('path');
const {
    spawnSync,
} = require('child_process');

const npmLink = (arrayNode) => {
    arrayNode.forEach((node) => {
        spawnSync('npm', ['link'], {
            shell: true,
            stdio: 'inherit',
            cwd: node,
        });
    });
};

const updateRepos = (arrayNode) => {
    arrayNode.forEach((node) => {
        spawnSync('git', ['checkout', 'master'], {
            shell: true,
            stdio: 'inherit',
            cwd: node,
        });
        spawnSync('git', ['pull', 'origin', 'master'], {
            shell: true,
            stdio: 'inherit',
            cwd: node,
        });
    });
};

const deleteExistingDirs = (arrayNode) => {
    arrayNode.forEach((node) => {
        const pathToPackageLock = path.join(node, 'package-lock.json');
        const pathToNodeModules = path.join(node, 'node_modules');
        fs.removeSync(pathToPackageLock);
        fs.removeSync(pathToNodeModules);
    });
};

const installNodeModules = (arrayNode) => {
    arrayNode.forEach((node) => {
        spawnSync('npm', ['install'], {
            shell: true,
            stdio: 'inherit',
            cwd: node,
        });
    });
};

const linkNodes = (nodeSalesforce, nodeDx) => {
    spawnSync('npm', ['link', '@appirio/appirio'], {
        shell: true,
        stdio: 'inherit',
        cwd: nodeSalesforce,
    });
    spawnSync('npm', ['link', '@appirio/appirio'], {
        shell: true,
        stdio: 'inherit',
        cwd: nodeDx,
    });
    spawnSync('npm', ['link', '@appirio/salesforce'], {
        shell: true,
        stdio: 'inherit',
        cwd: nodeDx,
    });
};

module.exports = {
    npmLink,
    updateRepos,
    deleteExistingDirs,
    installNodeModules,
    linkNodes,
};
