# JedsGraph
A Neo4j graph visualizer built over VivaGraphJS.

Hey, so I'm still in the process of laying things out in an orderly fashion, 
but to try it out you can run the HTML file "src\JedsGraph.html"
To hook it up to a Neo4jDatabase, just change the "neo4jconnection" values in the \src\custom\defaultConfig.json file(or one of the config files)

The VivaGraphJS library allows you to visually create a graph by adding nodes to a stage and then linking them.
It handles the physics of the nodes and links.

JedsGraph adds: 
- Connection to a Neo4j database, 
- UI elements for manipulating items on the stage (and in the database3)
- visual styling, including auto shapes, colors, animations, sizing, info popouts and more
- customization of features using the configuration files.
- functions such db-monitoring, generating json snippets, etc.

To modify the appearance, or funcitons of the graph, you can adjust the following files
\src\custom\defaultConfig.json
\src\custom\config\Data1.json
\src\custom\config\Data2.json

Configs
--------
The defaultConfig.json file is the base config,
Data1 and Data2, replace config settings in the defaultConfig.json file.
You can add more configs, but just be sure to add their references to JedsGraph.html.
The config files allow you to pull in entities from different Neo4j databases, onto one stage.
You can style the entities differently in each config, so that its clear which entities came from which sources.
You can also use the configs to just allow changing of styles during usage.