const fs = require('fs-extra');
const path = require('path');
const {
  spawnSync,
} = require('child_process');

const yarnLink = (arrayNode) => {
  arrayNode.forEach((node) => {
    spawnSync('yarn', ['link'], {
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
    // If there are changes in package-lock.json, reset them for now
    // so that working directory is clean.
    spawnSync('git', ['pull', 'origin', 'master'], {
      shell: true,
      stdio: 'inherit',
      cwd: node,
    });
  });
};

const deleteExistingDirs = (arrayNode) => {
  arrayNode.forEach((node) => {
    const pathToNodeModules = path.join(node, 'node_modules');
    fs.removeSync(pathToNodeModules);
  });
};

const installYarnModules = (arrayNode) => {
  arrayNode.forEach((node) => {
    spawnSync('yarn', ['install'], {
      shell: true,
      stdio: 'inherit',
      cwd: node,
    });
  });
};

const linkNodes = (nodeSalesforce, nodeDx) => {
  spawnSync('yarn', ['link', '@appirio/appirio'], {
    shell: true,
    stdio: 'inherit',
    cwd: nodeSalesforce,
  });
  spawnSync('yarn', ['link', '@appirio/appirio'], {
    shell: true,
    stdio: 'inherit',
    cwd: nodeDx,
  });
  spawnSync('yarn', ['link', '@appirio/salesforce'], {
    shell: true,
    stdio: 'inherit',
    cwd: nodeDx,
  });
};

const unlinkDX = nodeDx => spawnSync('yarn', ['unlink'], {
  shell: true,
  stdio: 'inherit',
  cwd: nodeDx,
});

const updateYarnModules = nodeDx => spawnSync('yarn', ['update'], {
  shell: true,
  stdio: 'inherit',
  cwd: nodeDx,
});

const commitUpdatedDependency = (nodeDx) => {
  spawnSync('git', ['add', '.'], {
    shell: true,
    stdio: 'inherit',
    cwd: nodeDx,
  });
  spawnSync('git', ['commit', '-m', '"Updated Dependencies"'], {
    shell: true,
    stdio: 'inherit',
    cwd: nodeDx,
  });
  spawnSync('git', ['push', 'origin', 'master'], {
    shell: true,
    stdio: 'inherit',
    cwd: nodeDx,
  });
};

const patchDX = nodeDx => spawnSync('npm', ['version', 'patch'], {
  shell: true,
  stdio: 'inherit',
  cwd: nodeDx,
});

module.exports = {
  yarnLink,
  updateRepos,
  deleteExistingDirs,
  installYarnModules,
  linkNodes,
  unlinkDX,
  patchDX,
  commitUpdatedDependency,
  updateYarnModules,
};
