/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/honey-votes/auth/me": {
    get: operations["AuthController_me"];
  };
  "/api/honey-votes/auth/refresh-token": {
    post: operations["AuthController_refreshToken"];
  };
  "/api/honey-votes/users": {
    get: operations["UsersController_getUserByLogin"];
  };
  "/api/honey-votes/voting": {
    get: operations["VotingController_getVotingList"];
    post: operations["VotingController_addVoting"];
  };
  "/api/honey-votes/voting/{votingId}": {
    get: operations["VotingController_getVoting"];
    put: operations["VotingController_updateVoting"];
    delete: operations["VotingController_removeVoting"];
  };
  "/api/honey-votes/voting-options": {
    post: operations["VotingOptionsController_addVotingOption"];
  };
  "/api/honey-votes/voting-options/{votingOptionId}": {
    delete: operations["VotingOptionsController_removeVotingOption"];
  };
  "/api/honey-votes/votes": {
    post: operations["VotesController_addVote"];
  };
  "/api/honey-votes/votes/{voteId}": {
    delete: operations["VotesController_removeVote"];
  };
  "/api/honey-votes/chat-votes": {
    post: operations["ChatVotesController_addChatVoting"];
  };
  "/api/honey-votes/chat-votes/{chatVotingId}": {
    put: operations["ChatVotesController_updateChatVoting"];
    delete: operations["ChatVotesController_removeChatVoting"];
  };
  "/api/honey-votes/chat-votes/{chatVotingId}/clear": {
    post: operations["ChatVotesController_clearChatVotes"];
  };
}

export interface components {
  schemas: {
    User: {
      id: string;
      login: string;
      displayName: string;
      avatarUrl: string;
      areTokensValid: boolean;
      createdAt: string;
      updatedAt: string;
    };
    RefreshTokenDto: {
      refreshToken: string;
    };
    RefreshTokenResponse: {
      accessToken: string;
      refreshToken: string;
    };
    UserTypeParams: {
      canVote: boolean;
      canAddOptions: boolean;
    };
    UserTypeParamsFollower: {
      canVote: boolean;
      canAddOptions: boolean;
      minutesToFollowRequiredToVote: number;
      minutesToFollowRequiredToAddOptions: number;
    };
    UserTypesParams: {
      mod: components["schemas"]["UserTypeParams"];
      vip: components["schemas"]["UserTypeParams"];
      subTier1: components["schemas"]["UserTypeParams"];
      subTier2: components["schemas"]["UserTypeParams"];
      subTier3: components["schemas"]["UserTypeParams"];
      follower: components["schemas"]["UserTypeParamsFollower"];
      viewer: components["schemas"]["UserTypeParams"];
    };
    Voting: {
      id: number;
      broadcasterId: string;
      title?: string;
      description?: string;
      canManageVotes: boolean;
      canManageVotingOptions: boolean;
      userTypesParams: components["schemas"]["UserTypesParams"];
      allowedVotingOptionTypes: ("kinopoiskMovie" | "igdbGame" | "custom")[];
      votingOptionsLimit: number;
      createdAt: string;
      updatedAt: string;
    };
    AddVotingDto: {
      title?: string;
      description?: string;
      canManageVotes?: boolean;
      canManageVotingOptions?: boolean;
      userTypesParams?: components["schemas"]["UserTypesParams"];
      allowedVotingOptionTypes?: ("kinopoiskMovie" | "igdbGame" | "custom")[];
      votingOptionsLimit?: number;
      channelId: string;
    };
    UpdateVotingDto: {
      title?: string;
      description?: string;
      canManageVotes?: boolean;
      canManageVotingOptions?: boolean;
      userTypesParams?: components["schemas"]["UserTypesParams"];
      allowedVotingOptionTypes?: ("kinopoiskMovie" | "igdbGame" | "custom")[];
      votingOptionsLimit?: number;
    };
    VotingOptionKinopoiskMovie: {
      id: number;
    };
    VotingOptionIgdbGame: {
      id: number;
    };
    VotingOptionCustom: {
      title: string;
      description?: string;
    };
    AddVotingOptionDto: {
      votingId: number;
      type: string;
      kinopoiskMovie?: components["schemas"]["VotingOptionKinopoiskMovie"];
      igdbGame?: components["schemas"]["VotingOptionIgdbGame"];
      custom?: components["schemas"]["VotingOptionCustom"];
    };
    VotingOption: {
      id: number;
      authorId: string;
      votingId: number;
      fullVotesValue: number;
      cardId?: number;
      cardTitle: string;
      cardSubtitle?: string;
      cardDescription?: string;
      cardImageUrl?: string;
      cardUrl?: string;
      createdAt: string;
      updatedAt: string;
    };
    AddVoteDto: {
      votingOptionId: number;
    };
    ChatVotingRestrictions: {
      viewer: boolean;
      subTier1: boolean;
      subTier2: boolean;
      subTier3: boolean;
      mod: boolean;
      vip: boolean;
      subMonthsRequired: number;
    };
    AddChatVotingDto: {
      restrictions?: components["schemas"]["ChatVotingRestrictions"];
      listening?: boolean;
      broadcasterId: string;
    };
    ChatVoting: {
      broadcasterId: string;
      restrictions: components["schemas"]["ChatVotingRestrictions"];
      listening: boolean;
      createdAt: string;
      updatedAt: string;
    };
    UpdateChatVotingDto: {
      restrictions?: components["schemas"]["ChatVotingRestrictions"];
      listening?: boolean;
    };
  };
}

export interface operations {
  AuthController_me: {
    parameters: {};
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** Unauthorized */
      401: unknown;
    };
  };
  AuthController_refreshToken: {
    parameters: {};
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["RefreshTokenResponse"];
        };
      };
      /** Bad Request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RefreshTokenDto"];
      };
    };
  };
  UsersController_getUserByLogin: {
    parameters: {
      query: {
        login?: string;
        id?: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** Bad request */
      400: unknown;
      /** Not found */
      404: unknown;
    };
  };
  VotingController_getVotingList: {
    parameters: {
      query: {
        channelId: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["Voting"][];
        };
      };
    };
  };
  VotingController_addVoting: {
    parameters: {};
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["Voting"];
        };
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AddVotingDto"];
      };
    };
  };
  VotingController_getVoting: {
    parameters: {
      path: {
        votingId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": components["schemas"]["Voting"];
        };
      };
      /** Not found */
      404: unknown;
    };
  };
  VotingController_updateVoting: {
    parameters: {
      path: {
        votingId: number;
      };
    };
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["Voting"];
        };
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateVotingDto"];
      };
    };
  };
  VotingController_removeVoting: {
    parameters: {
      path: {
        votingId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
  };
  VotingOptionsController_addVotingOption: {
    parameters: {};
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["VotingOption"];
        };
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AddVotingOptionDto"];
      };
    };
  };
  VotingOptionsController_removeVotingOption: {
    parameters: {
      path: {
        votingOptionId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
  };
  VotesController_addVote: {
    parameters: {};
    responses: {
      /** Created */
      201: unknown;
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AddVoteDto"];
      };
    };
  };
  VotesController_removeVote: {
    parameters: {
      path: {
        voteId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
  };
  ChatVotesController_addChatVoting: {
    parameters: {};
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["ChatVoting"];
        };
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AddChatVotingDto"];
      };
    };
  };
  ChatVotesController_updateChatVoting: {
    parameters: {
      path: {
        chatVotingId: string;
      };
    };
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["ChatVoting"];
        };
      };
      /** Bad request */
      400: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateChatVotingDto"];
      };
    };
  };
  ChatVotesController_removeChatVoting: {
    parameters: {
      path: {
        chatVotingId: string;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
  };
  ChatVotesController_clearChatVotes: {
    parameters: {
      path: {
        chatVotingId: string;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Unauthorized */
      401: unknown;
      /** Forbidden */
      403: unknown;
    };
  };
}
