# Printing an indented tree of Wikipedia links

## Overview

This simple script script will fetch links as strings from Wikipedia, and print them out to the depth & breadth desired.

## Installation

1. Install Node.js.
2. Run 'npm install' in the project folder.

## Running

* Run the command 'node index.js articleName' in the project folder, replacing 'articleName' with a Wikipedia article's link url.

* The initial article will act as the starting point; the optional second argument (number) defines the depth that article links
will be followed for, while the optional third argument (number) defines the breadth (i.e., how many follow-up links to print from each article).

* A fourth argument (number) can be used to specify the indentation of each tier of printed links. By default, the amount of indent spaces is 2.

### Example

node index.js Light 2 3

Light
  Electromagnetic_radiation
    Linear_polarization
    Physics
    Electromagnetic_field
  Dispersive_prism
    Fused_quartz
    Ultraviolet
    Infrared
  Dispersion_(optics)
    Linear_response_function
    Electric_susceptibility
    Electromagnetic_spectrum#Visible_radiation_(light)

## Limitations

* The parsing of the fetched links is rudimentary and leads to abrupt halts or meta-elements being fetched sometimes.

* It is wasteful to fetch the entire articles, but there is no reliable way to exclude unneeded links if using the Wikipedia API to fetch all links only.