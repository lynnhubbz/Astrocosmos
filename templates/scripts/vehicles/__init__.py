import typing

from ..base import AstrocosmosID, Vehicle

# ======================================================================== #
# VEHICLE SETTINGS                                                         #
# ======================================================================== #

prefixes_vehicles   = typing.Literal['WIP PREFIXES']

# ======================================================================== #
# SPACESHIPS SETTINGS                                                      #
# ======================================================================== #

options_etc1        = typing.Literal['no_feature', 'one_and_minimum', 'complete_sets']

options_FnC         = typing.Literal['cockpit','command_deck']
options_wings       = typing.Literal['no_wing', 'distinguished', 'resembles']
options_dockingport = int
options_CIC         = typing.Literal[options_etc1]
options_enginedeck  = typing.Literal[options_etc1]
options_astrodeck   = typing.Literal[options_etc1]
options_lsdeck      = typing.Literal[options_etc1]
options_sickbaydeck = typing.Literal[options_etc1]
options_EMGdeck     = typing.Literal['selfeject_cockpit', options_etc1]
options_cargohold   = int
options_hangarbay   = int
options_artigrav    = bool

types_spaceship     = typing.Literal['WIP TYPES']



class SpaceShip(Vehicle):
    """
    """

# Initialization --------------------------------------------------------- #

    def __init__(
            self
        ):
        """
        """
        self.flight_n_control_station   = None
        self.wing_visibility            = None
        self.port_docking               = None
        self.combatinformationcenter    = None
        self.deck_engine                = None
        self.deck_astrogation           = None
        self.deck_lifesupport           = None
        self.hold_cargo                 = None
        self.bay_hangar                 = None
        self.artifical_gravity          = None

    def config_feature(
            self, 
            flight_and_control_station  :typing.Optional[options_FnC]           =None,
            wing_visibility             :typing.Optional[options_wings]         =None,
            port_docking                :typing.Optional[options_dockingport]   =None,
            combatinformationcenter     :typing.Optional[options_CIC]           =None,
            deck_engine                 :typing.Optional[options_enginedeck]    =None,
            deck_astrogation            :typing.Optional[options_astrodeck]     =None
        ):
        """
        """
        self.flight_n_control_station   = flight_and_control_station
        self.wing_visibility            = wing_visibility
        self.port_docking               = port_docking
        self.combatinformationcenter    = combatinformationcenter
        self.deck_engine                = deck_engine
        self.deck_astrogation           = deck_astrogation
        self.deck_lifesupport           = None
        self.hold_cargo                 = None
        self.bay_hangar                 = None
        self.artifical_gravity          = None

# Spaceship Types -------------------------------------------------------- #

    def config_type(self):
        pass
    
    def config_prefixes(self):
        pass

# Spaceships Universal Attributes And Methods ----------------------------- #

    def config_feature_focused(self):
        pass

    def config_feature_fnc(
            self,
            fncstation_count  :int
        ):
        self.fncstation_count = fncstation_count

        return self

    def config_feature_wing(
            self,
            wing_count  :int
        ):
        self.wing_count = wing_count

        return self

    def config_design(self):
        pass



    # Spaceships prefixes
