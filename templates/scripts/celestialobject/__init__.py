from templates.scripts.base import AstrocosmosID, CelestialObject

class Star(CelestialObject):
    """
    """

class Planet(CelestialObject):
    """
    """

# This below are taken from and are implementation of the former Excel database

import random
import roman

class celestialobjectname():

    def __init__(self, desc, moonORplanet, name, primarybody):
        self.desc = desc
        self.moonORplanet = moonORplanet
        self.name = name
        self.primarybody = primarybody

        # Convert inputs to strings and clean whitespace
        self.r_str = str(self.desc).strip() if self.desc is not None else ""
        self.s_str = str(self.moonORplanet).lower() if self.moonORplanet is not None else ""
        self.t_str = str(self.name) if self.name is not None else ""
        self.b_str = str(self.primarybody) if self.primarybody is not None else ""

    def callknownname(self):

        # Part 1: Prefix
        prefix = f"{self.r_str} " if self.r_str else ""

        # Parts 2 & 3: Type and Suffix logic
        if "moon" in self.s_str:
            obj_type = "Moon"
            suffix = f" of {self.t_str}"
        elif "planet" in self.s_str:
            obj_type = "Planet"
            suffix = f" {self.b_str}"
        else:
            obj_type = "WHAT IS THIS"
            suffix = ""

        # Combine parts into a single string
        return f"{prefix}{obj_type}{suffix}"

    def callunknownname(self):
                # Generates a random integer where 1 <= number <= 10
        random_number = roman.toRoman(random.randint(1, 10))
        return f"{self.b_str} {random_number}"