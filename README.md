# Close PagerDuty Maintenance Window

This action will close a PagerDuty Maintenance Window using a provided maintenance window ID.
    
## Index 

- [Inputs](#inputs)
- [Example](#example)
- [Contributing](#contributing)
  - [Recompiling](#recompiling)
  - [Incrementing the Version](#incrementing-the-version)
- [Code of Conduct](#code-of-conduct)
- [License](#license)
  
## Inputs
| Parameter               | Is Required | Description                                                                            |
| ----------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `pagerduty-api-key`     | true        | The PagerDuty api key that allows access to your services.                             |
| `maintenance-window-id` | true        | The ID of the maintenance window to be closed.                                         |
| `minutes`               | false       | The number of minutes to close the window in.  Defaults to 3.  Must be greater than 0. |


## Example

```yml
  jobs:
    deploy-the-code:
    runs-on: [self-hosted, ubuntu-20.04]
    steps:
      - uses: actions/checkout@v3

      - name: Open a window
        id: open-window
        uses: im-open/open-pagerduty-maintenance-window@v1.1.4
        with:
          pagerduty-api-key: ${{secrets.PAGERDUTY_API_KEY}}
          description: 'Code deployment from GitHub Actions'
          minutes: 15
          service-ids: '[ "P0ABCDE" ]'
      
      - run: |
          deploy-the-code.sh
      
      - name: Close a window
        uses: im-open/close-pagerduty-maintenance-window@v1.0.6
        with:
          pagerduty-api-key: ${{secrets.PAGERDUTY_API_KEY}}
          maintenance-window-id: ${{ steps.open-window.outputs.maintenance-window-id }}
```

## Contributing

When creating new PRs please ensure:
1. The action has been recompiled.  See the [Recompiling](#recompiling) section below for more details.
2. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
3. The `README.md` example has been updated with the new version.  See [Incrementing the Version](#incrementing-the-version).
4. The action code does not contain sensitive information.

### Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge.  The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment                     |
| -------------- | ------------------------------------------- |
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).

[git-version-lite]: https://github.com/im-open/git-version-lite
