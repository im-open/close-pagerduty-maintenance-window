const core = require('@actions/core');
const axios = require('axios');
const add = require('date-fns/add');
const format = require('date-fns/format');

// When used, this requiredArgOptions will cause the action to error if a value has not been provided.
const requiredArgOptions = {
  required: true,
  trimWhitespace: true
};

const pagerdutyApiKey = core.getInput('pagerduty-api-key', requiredArgOptions);
const maintenanceWindowId = core.getInput('maintenance-window-id', requiredArgOptions);
const minutes = parseInt(core.getInput('minutes'));

try {
  if (minutes <= 0) core.setFailed('The minutes argument must be greater than 0.');

  const endDate = add(new Date(), {
    minutes: minutes
  });
  const end_time = `${format(endDate, 'yyyy-MM-dd')}T${format(endDate, 'HH:mm:sszzzz')}Z`;
  core.info(`Window will end in ${minutes} minute(s) at ${end_time}`);

  const maintenanceWindow = {
    maintenance_window: {
      id: maintenanceWindowId,
      type: 'maintenance_window',
      end_time
    }
  };

  axios({
    method: 'put',
    url: `https://api.pagerduty.com/maintenance_windows/${maintenanceWindowId}`,
    headers: {
      'content-type': 'application/json',
      authorization: `Token token=${pagerdutyApiKey}`,
      accept: 'application/vnd.pagerduty+json;version=2'
    },
    data: JSON.stringify(maintenanceWindow)
  })
    .then(function () {
      core.info(`The maintenance window was successfully set to close in ${minutes} minute(s).`);
    })
    .catch(function (error) {
      core.setFailed(
        `An error making the request to close the PagerDuty maintenance window: ${error.message}`
      );
      return;
    });
} catch (error) {
  core.setFailed(
    `An error occurred while closing the PagerDuty maintenance window: ${error.message}`
  );
}
