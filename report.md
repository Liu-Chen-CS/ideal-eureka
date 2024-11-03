# Bugs
 - loading circle texts rotates as well
 - lots of errors in console when just opening the page: e.g. TypeError: Cannot read properties of undefined (reading 'create')
    at addRegion (/home/tw3nty/bonus/FERedesign/middleware/src/controllers/region.controller.ts:24:57)
    at Layer.handle [as handle_request] (/home/tw3nty/bonus/FERedesign/node_modules/express/lib/router/layer.js:95:5)
 - cant submit the form - just modal with test_01 and test_02
 - drag and drop does not work for uploading csv files
 - default "restmenge" is not actually the default - cant submit without entering stuff
 - empty accordion at the top of the form

# TODO
 - translations missing
 - adjust responsiveness and sizing of region list to bonus list
 - replace german file names with english text -> no uppercase characters
 - remove toggle switch
 - if possible, remove extra ant design libary and migrate to material ui
