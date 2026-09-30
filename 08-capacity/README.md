# 08 - Capacity and cost: pause and resume from code

A Fabric capacity bills every hour it runs, whether anyone opens a report or not.
This script pauses and resumes it through the Azure Resource Manager API, so you can
put it on a schedule.

## Permissions

The same service principal needs these actions on the capacity resource in Azure
(a custom role scoped to the capacity is enough; Contributor works but grants more):

- `Microsoft.Fabric/capacities/read`
- `Microsoft.Fabric/capacities/write`
- `Microsoft.Fabric/capacities/suspend/action`
- `Microsoft.Fabric/capacities/resume/action`

Set `SUBSCRIPTION_ID`, `RESOURCE_GROUP` and `CAPACITY_NAME` in `.env`.

## Run

```bash
npm run ep08 -- status
npm run ep08 -- pause
npm run ep08 -- resume
```

## Notes

- While paused, every report on the capacity stops loading. Pause dev/test freely;
  for production, pause only when you know nobody is using it.
- Pausing adds any outstanding smoothed usage to the bill at that moment.
- Watch actual load in the Fabric Capacity Metrics app before resizing.
