%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                Game state                                  %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%    Black Rook    |    Black kNight    |    Black Bishop    |     Black Queen    |     Black King     |    Black Bishop    |    Black kNight    |     Black Rook     |
%    Black Pawn    |     Black Pawn     |     Black Pawn     |     Black Pawn     |     Black Pawn     |     Black Pawn     |     Black Pawn     |     Black Pawn     |
cell(point(0,7),br). cell(point(1,7),bn). cell(point(2,7),bb). cell(point(3,7),bq). cell(point(4,7),bk). cell(point(5,7),bb). cell(point(6,7),bn). cell(point(7,7),br).
cell(point(0,6),bp). cell(point(1,6),bp). cell(point(2,6),bp). cell(point(3,6),bp). cell(point(4,6),bp). cell(point(5,6),bp). cell(point(6,6),bp). cell(point(7,6),bp).
cell(point(0,5),e).  cell(point(1,5),e).  cell(point(2,5),e).  cell(point(3,5),e).  cell(point(4,5),e).  cell(point(5,5),e).  cell(point(6,5),e).  cell(point(7,5),e). % empty row
cell(point(0,4),e).  cell(point(1,4),e).  cell(point(2,4),e).  cell(point(3,4),e).  cell(point(4,4),e).  cell(point(5,4),e).  cell(point(6,4),e).  cell(point(7,4),e). % empty row
cell(point(0,3),e).  cell(point(1,3),e).  cell(point(2,3),e).  cell(point(3,3),e).  cell(point(4,3),e).  cell(point(5,3),e).  cell(point(6,3),e).  cell(point(7,3),e). % empty row
cell(point(0,2),e).  cell(point(1,2),e).  cell(point(2,2),e).  cell(point(3,2),e).  cell(point(4,2),e).  cell(point(5,2),e).  cell(point(6,2),e).  cell(point(7,2),e). % empty row
cell(point(0,1),wp). cell(point(1,1),wp). cell(point(2,1),wp). cell(point(3,1),wp). cell(point(4,1),wp). cell(point(5,1),wp). cell(point(6,1),wp). cell(point(7,1),wp).
cell(point(0,0),wr). cell(point(1,0),wn). cell(point(2,0),wb). cell(point(3,0),wq). cell(point(4,0),wk). cell(point(5,0),wb). cell(point(6,0),wn). cell(point(7,0),wr).
%    White Pawn    |     White Pawn     |     White Pawn     |     White Pawn     |     White Pawn     |     White Pawn     |     White Pawn     |     White Pawn     .
%    White Rook    |    White kNight    |    White Bishop    |     White Queen    |     White King     |    White Bishop    |    White kNight    |     White Rook     .

turn(white).          % white, black
gave_up(none).        % white, black, none
agreed_to_draw(none). % white, black, none


%%% Will contain a list of couples.
%%% Each couple is formed by a list of retracted cells and a list of asserted cells;
%%% this way, it's possible to keep track of every update done on the board
% history(-Board_updates_list)
history([]).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%              Pieces, teams and current result information                  %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

pawn(wp).   pawn(bp).    % white and black Pawns
rook(wr).   rook(br).    % white and black Rooks
king(wk).   king(bk).    % white and balck Kings
queen(wq).  queen(bq).   % white and black Queens
knight(wn). knight(bn).  % white and black kNights
bishop(wb). bishop(bb).  % white and black Bishops

% team(?Piece, ?Color)
team(Piece, white) :- member(Piece, [wp,wr,wn,wb,wq,wk]).
team(Piece, black) :- member(Piece, [bp,br,bn,bb,bq,bk]).

% allies(?Piece1, ?Piece2)
allies(Piece1, Piece2) :-
  team(Piece1, Color),
  team(Piece2, Color).

% enemies(?Piece1, ?Piece2)
enemies(Piece1, Piece2) :-
  team(Piece1, Color1),
  team(Piece2, Color2),
  Color1 \= Color2.

% result(?R)
result(win(white)) :- gave_up(black), !.
result(win(white)) :- turn(black), under_checkmate(black), !.
result(win(black)) :- gave_up(white), !.
result(win(black)) :- turn(white), under_checkmate(white), !.
result(draw) :- agreed_to_draw(white), !.
result(draw) :- agreed_to_draw(black), !.
result(draw) :- turn(C), under_stall(C), !.
result(draw) :- only_kings_on_board, !.
result(under_check) :- turn(C), under_check(C), !.
result(nothing).


%%% Retrieves all the chessboard cells in a list of lists, useful for client requests:
%%% each sub-list is composed by X coordinate, Y coordinate and the respective Content.
% chessboard(-Cells_list)
chessboard(Cells_list) :- findall(cell(P,Content), cell(P,Content), Cells_list).

% chessboard(-Compact_list)
chessboard_compact(Compact_list) :- findall([X,Y,Content], cell(point(X,Y), Content), Compact_list).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%           General functionalities for history and staus update             %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% next_turn(?Previous, ?Next)
next_turn(white, black).
next_turn(black, white).

% change_turn
change_turn :-
  turn(Current),
  next_turn(Current, Next),
  retract(turn(Current)),
  assert(turn(Next)),
  !. % red cut!

% give_up(+Color)
give_up(Color) :-
  retract(gave_up(none)),
  assert(gave_up(Color)).

% agree_to_draw(+Color)
agree_to_draw(Color) :-
  retract(agreed_to_draw(none)),
  assert(agreed_to_draw(Color)).

%%% Updates the game status:
%%% - retracts all the cells inside the To_retract list
%%% - asserts all the cells inside the To_assert list
%%% - changes the turn
%%% - updates the history, adding this update
% update_board(+To_retract, +To_assert)
update_board(To_retract, To_assert) :-
  retract_these(To_retract),
  assert_these(To_assert),
  retract(history(Old_history)),
  append([(To_retract, To_assert)], Old_history, Updated_history),
  assert(history(Updated_history)),
  change_turn.

%%% Reverts the last update thanks to the info inside history:
%%% - retracts all the cells that had been asserted in the last board update
%%% - asserts all the cells that had been retracted in the last board update
%%% - changes the turn
%%% - updates the history, erasing the last update
% change_turn
undo_last_update :-
  retract(history([(Last_retracted_list, Last_asserted_list) | Older_history])),
  retract_these(Last_asserted_list),
  assert_these(Last_retracted_list),
  assert(history(Older_history)),
  change_turn.


%%% Utility for multiple retractions
% retract_these(+List)
retract_these([]).
retract_these([Head | Tail]) :- retract(Head), retract_these(Tail).

%%% Utility for multiple assertions
% assert_these(+List)
assert_these([]).
assert_these([Head | Tail]) :- assert(Head), assert_these(Tail).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%               Some chess concepts and other useful stuff                   %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% under_enemy_attack(+P)
under_enemy_attack(P) :-
  cell(Pi, Pi_content),
  legal_move(Pi, P),
  %DEBUG: print(Pi),
  !.  % green cut

% under_check(+Color)
under_check(Color) :-
  king(K),
  team(K, Color),
  cell(P, K),
  under_enemy_attack(P),
  !.  % green cut

% under_stall(+Color)
under_stall(Color) :-
  not under_check(Color),
  not can_move(Color).

% under_checkmate(+Color)
under_checkmate(Color) :-
  under_check(Color),
  not can_move(Color).


new_position_not_under_check(P0, P) :-
  team(Piece, Color),
  cell(P0, Piece),
  cell(P, P_content),
  update_board([cell(P0,Piece), cell(P,P_content)], [cell(P0,e), cell(P,Piece)]),
  (
    (
      not(under_check(Color)),
      undo_last_update,  % modifying the knowledge base! (and changing turn...)
      true,
      !
    );
    (
      under_check(Color),
      undo_last_update,  % modifying the knowledge base! (and changing turn...)
      fail
    )
  ).


%%% Pawns must promote when reaching the last row.
% must_promote(+Piece, +P)
must_promote(Piece, P) :-
  pawn(Piece),
  team(Piece, Color),
  last_row(P, Color).

% Pawns can promote to a queen, a knight, a bishop or a rook of the same team.
% legal_promotion(+Piece, ?To_piece)
legal_promotion(Piece, To_piece) :-
  allies(Piece, To_piece),
  (queen(To_piece); knight(To_piece); bishop(To_piece); rook(To_piece)).


% only_kings_on_board
only_kings_on_board :-
  not cell(_,wp), not cell(_,bp), % no pawns
  not cell(_,wr), not cell(_,br), % no rooks
  not cell(_,wn), not cell(_,bn), % no knights
  not cell(_,wb), not cell(_,bb), % no bishops
  not cell(_,wq), not cell(_,bq). % no queens


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                Specific functionalities for movements                      %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%% True for every point P of the board still not involved in any movement:
%%% no piece has moved to or from that point since the beginning of the game.
% never_moved(?P)
never_moved(P) :-
  history(H),
  cell(P,_),
  never_moved(P, H).

% never_moved(+P, +History)
never_moved(P, []).
never_moved(P, [(Last_retracted_list, Last_asserted_list) | Older_history]) :-
  not member(cell(P, _), Last_retracted_list),
  not member(cell(P, _), Last_asserted_list),
  never_moved(P, Older_history).


% can_move(+Color)
can_move(Color) :-
  cell(P0, Ally),
  team(Ally, Color),
  available_move(P0, _),
  !. % green cut


% available_move(+Piece, +P0, ?P)
available_move(P0, P) :-
  (legal_move(P0, P) ; legal_short_castle(P0, P) ; legal_long_castle(P0, P)),
  new_position_not_under_check(P0, P).

% available_moves(+P0, ?Points_list)
available_moves(P0, Coordinates_list) :- findall(P, available_move(P0, P), Coordinates_list).

% available_moves(+Coordinates, ?Coordinates_list)
available_moves_compact([X0,Y0], Coordinates_list) :- findall([X,Y], available_move(point(X0,Y0), point(X,Y)), Coordinates_list).


%%% Move the Piece, if possible, from P0 to P
% do_move(+Piece, +P0, +P)
do_move(Piece, P0, P) :-
  move_integrity_check(Piece, P0, P),
  not must_promote(Piece, P), % when reaching the last row, a pawn cannot move without promotion
  cell(P, P_content),
  update_board(
    [cell(P0,Piece), cell(P,P_content)], % things to retract
    [cell(P0,e), cell(P,Piece)]          % things to assert
  ).

%%% Move the Piece, if possible, from P0 to P and promote it to Promoted_piece
% do_move_and_promote(+Piece, +P0, +P, +Promoted_piece)
do_move_and_promote(Piece, P0, P, Promoted_piece) :-
  move_integrity_check(Piece, P0, P),
  must_promote(Piece, P),
  legal_promotion(Piece, To_piece),
  cell(P, P_content),
  update_board(
    [cell(P0, Piece), cell(P, P_content)],  % things to retract
    [cell(P0, e), cell(P, Promoted_piece)]  % things to assert
  ).

do_short_castle(Piece, P0, P2) :-
  short_castle_integrity_check(Piece, P0, P),
  steps_east(P0, P1, 1),
  steps_east(P0, P2, 2), % where the king wants to go
  steps_east(P0, P3, 3), % where the allied tower is
  update_board_for_castle(Piece, P0, P1, P2, P3).

do_long_castle(Piece, P0, P2) :-
  long_castle_integrity_check(Piece, P0, P),
  steps_west(P0, P1, 1),
  steps_west(P0, P2, 2), % where the king wants to go
  steps_west(P0, P4, 4), % where the allied tower is
  update_board_for_castle(Piece, P0, P1, P2, P4).


% move_integrity_check(+Piece, +P0, +P)
move_integrity_check(Piece, P0, P) :-
  (result(nothing); result(under_check)),
  cell(P0, Piece),
  turn(Color),
  team(Piece, Color),
  legal_move(P0, P),
  new_position_not_under_check(P0, P).

% castle_integrity_check(+Piece, +P0, +P)
castle_integrity_check(Piece, P0, P) :-
  result(nothing),
  cell(P0, Piece),
  turn(Color),
  team(Piece, Color),
  king(Piece),
  legal_castle(P0, P),
  new_position_not_under_check(P0, P).

update_board_for_castle(King, P0, P1, P2, PR) :-
  cell(PR, Rook),
  update_board(
    [cell(P0,King), cell(P1,e), cell(P2,e), cell(PR,Rook)], % things to retract
    [cell(P0,e), cell(P1,Rook), cell(P2,King), cell(PR,e)]  % things to assert
  ).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%            Standard legal moves by the book (for every piece)              %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% legal_move(+P0, ?P))

%%% Pawn

legal_move(P0, P) :-
  cell(P0, P0_content),
  pawn(P0_content),
  legal_pawn_move(P0, P).

legal_pawn_move(P0, P) :-
  steps_forward(P0, P, 1),
  cell(P, e).

legal_pawn_move(P0, P) :-
  never_moved(P0),
  steps_forward(P0, P, 2),
  cell(P, e),
  steps_forward(P0, P1, 1),
  cell(P1, e).

legal_pawn_move(P0, P) :-
  ( steps_forward_right(P0, P, 1) ; steps_forward_left(P0, P, 1) ),
  cell(P0, P0_content),
  cell(P, P_content),
  enemies(P0_content, P_content).

%%% Knight

legal_move(P0, P) :-
  cell(P0, P0_content),
  knight(P0_content),
  l_pattern(P0, P),
  cell(P, P_content),
  empty_or_enemy(P0_content, P_content).

%%% Bishop

legal_move(P0, P) :-
  cell(P0, P0_content),
  bishop(P0_content),
  cell(P, P_content),
  aligned_diagonally(P0, P),
  empty_or_enemy(P0_content, P_content),
  no_pieces_interposed(P0, P).

%%% Rook

legal_move(P0, P) :-
  cell(P0, P0_content),
  rook(P0_content),
  cell(P, P_content),
  aligned_axis(P0, P),
  empty_or_enemy(P0_content, P_content),
  no_pieces_interposed(P0, P).

%%% Queen

legal_move(P0, P) :-
  cell(P0, P0_content),
  queen(P0_content),
  cell(P, P_content),
  aligned(P0, P),
  empty_or_enemy(P0_content, P_content),
  no_pieces_interposed(P0, P).

%%% King

legal_move(P0, P) :-
  cell(P0, P0_content),
  king(P0_content),
  adjacent(P0, P),
  cell(P, P_content),
  empty_or_enemy(P0_content, P_content).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                        Legal castling by the book                          %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% legal_short_castle(+P0, ?P2)
legal_short_castle(P0, P2) :-
  cell(P0, P0_content),
  king(P0_content),
  never_moved(P0),
  not under_enemy_attack(P0),
  steps_east(P0, P2, 2), % where the king wants to go
  steps_east(P0, P1, 1),
  steps_east(P0, P3, 3), % east rook position
  cell(P1, e),
  cell(P2, e),
  never_moved(P3),
  update_board([cell(P0,P0_content)], [cell(P1,e)]),
  (
    (
      not under_enemy_attack(P1),
      undo_last_update,
      true,
      !
    ) ; (
      under_enemy_attack(P1),
      undo_last_update,
      fail
    )
  ).

% legal_long_castle(+P0, ?P2)
legal_long_castle(P0, P2) :-
  cell(P0, P0_content),
  king(P0_content),
  never_moved(P0),
  not under_enemy_attack(P0),
  steps_west(P0, P2, 2), % where the king wants to go
  steps_west(P0, P1, 1),
  steps_west(P0, P3, 3),
  steps_east(P0, P4, 4), % east rook position
  cell(P1, e),
  cell(P2, e),
  cell(P3, e),
  never_moved(P4),
  update_board([cell(P0,P0_content)], [cell(P1,e)]),
  (
    (
      not under_enemy_attack(P1),
      undo_last_update,
      (
        update_board([cell(P0,P0_content)], [cell(P2,e)]),
        (
          not under_enemy_attack(P2),
          undo_last_update,
          true,
          !
        ) ; (
          under_enemy_attack(P2),
          undo_last_update,
          fail
        )
      )
    ) ; (
      under_enemy_attack(P1),
      undo_last_update,
      fail
    )
  ).

% legal_castle(P0, P2)
legal_castle(P0, P2) :- legal_short_castle(P0, P2).
legal_castle(P0, P2) :- legal_long_castle(P0, P2).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                Handy spatial predicates for a chess board                  %%
%%         (white pieces face north, while black piece face south)            %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% NB: Remember that, by design, "Steps" > 0.
%%     At least one between "P" and "Steps" must be istantiated.

% steps
steps_forward(P0, P, Steps, white) :- steps_north(P0, P, Steps).
steps_forward(P0, P, Steps, black) :- steps_south(P0, P, Steps).
steps_forward(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_forward(P0, P, Steps, Color).

% steps_backward
steps_backward(P0, P, Steps, Color) :- Color = white, steps_south(P0, P, Steps).
steps_backward(P0, P, Steps, Color) :- Color = black, steps_north(P0, P, Steps).
steps_backward(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_backward(P0, P, Steps, Color).

% steps_right
steps_right(P0, P, Steps, Color) :- Color = white, steps_east(P0, P, Steps).
steps_right(P0, P, Steps, Color) :- Color = black, steps_west(P0, P, Steps).
steps_right(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_right(P0, P, Steps, Color).

% steps_left
steps_left(P0, P, Steps, Color) :- Color = white, steps_west(P0, P, Steps).
steps_left(P0, P, Steps, Color) :- Color = black, steps_east(P0, P, Steps).
steps_left(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_left(P0, P, Steps, Color).


% steps_forward_right
steps_forward_right(P0, P, Steps, Color) :- Color = white, steps_north_east(P0, P, Steps).
steps_forward_right(P0, P, Steps, Color) :- Color = black, steps_south_west(P0, P, Steps).
steps_forward_right(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_forward_right(P0, P, Steps, Color).

% steps_forward_left
steps_forward_left(P0, P, Steps, Color) :- Color = white, steps_north_west(P0, P, Steps).
steps_forward_left(P0, P, Steps, Color) :- Color = black, steps_south_east(P0, P, Steps).
steps_forward_left(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_forward_left(P0, P, Steps, Color).

% steps_backward_right
steps_backward_right(P0, P, Steps, Color) :- Color = white, steps_south_east(P0, P, Steps).
steps_backward_right(P0, P, Steps, Color) :- Color = black, steps_north_west(P0, P, Steps).
steps_backward_right(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_backward_right(P0, P, Steps, Color).

% steps_backward_left
steps_backward_left(P0, P, Steps, Color) :- Color = white, steps_south_west(P0, P, Steps).
steps_backward_left(P0, P, Steps, Color) :- Color = black, steps_north_east(P0, P, Steps).
steps_backward_left(P0, P, Steps) :- cell(P0, Piece), team(Piece, Color), steps_backward_left(P0, P, Steps, Color).


% last_row(+P, ?Color)
last_row(point(_,7), white).
last_row(point(_,0), black).

% empty_or_enemy(+Piece1, ?Piece2)
empty_or_enemy(Piece1, Piece2) :- enemies(Piece1, Piece2).
empty_or_enemy(_, e).

% no_pieces_interposed(+P0, +P)
no_pieces_interposed(P0, P) :- adjacent(P0, P).
no_pieces_interposed(P0, P) :- in_between(P0, P, Points), empty_cells(Points).

% empty_cells(+[Points]).
empty_cells([]).
empty_cells([Point | Points]) :-
  cell(Point, e),
  empty_cells(Points).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                           My SPACE 2D library                              %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%         Point representation in 2d space with integer coordinates          %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%point(?X, ?Y)
point(X, Y) :-
  (integer(X); var(X)),
  (integer(Y); var(Y)).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%    Projection of the vector point(X0,Y0) -> point(X,Y) on N,S,W,E axes     %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%projection_north(+point(X0,Y0), +point(X,Y), -Projection)
projection_north(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Y), Projection is Y - Y0, !.  % green cut
%projection_north(+point(X0,Y0), -point(X,Y), +Projection)
projection_north(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Projection), Y is Y0 + Projection.

%projection_south(+point(X0,Y0), +point(X,Y), -Projection)
projection_south(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Y), Projection is Y0 - Y, !.  % green cut
%projection_south(+point(X0,Y0), -point(X,Y), +Projection)
projection_south(point(_,Y0), point(_,Y), Projection) :- nonvar(Y0), nonvar(Projection), Y is Y0 - Projection.

%projection_east(+point(X0,Y0), +point(X,Y), -Projection)
projection_east(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(X), Projection is X - X0, !.  % green cut
%projection_east(+point(X0,Y0), -point(X,Y), +Projection)
projection_east(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(Projection), X is X0 + Projection.

%projection_west(+point(X0,Y0), +point(X,Y), -Projection)
projection_west(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(X), Projection is X0 - X, !.  % green cut
%projection_west(+point(X0,Y0), -point(X,Y), +Projection)
projection_west(point(X0,_), point(X,_), Projection) :- nonvar(X0), nonvar(Projection), X is X0 - Projection.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%       Moving some steps towards one particular direction (N,S,W,E)         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% By design, "Steps" > 0.

%steps_north(+P0, ?P, ?Steps)
steps_north(P0, P, Steps) :-
  projection_north(P0, P, Steps),
  projection_east(P0, P, 0),
  Steps > 0.

%steps_south(+P0, ?P, ?Steps)
steps_south(P0, P, Steps) :-
  projection_south(P0, P, Steps),
  projection_east(P0, P, 0),
  Steps > 0.

%steps_east(+P0, ?P, ?Steps)
steps_east(P0, P, Steps) :-
  projection_east(P0, P, Steps),
  projection_north(P0, P, 0),
  Steps > 0.

%steps_west(+P0, ?P, ?Steps)
steps_west(P0, P, Steps) :-
  projection_west(P0, P, Steps),
  projection_north(P0, P, 0),
  Steps > 0.

%steps_north_east(+P0, ?P, ?Steps)
steps_north_east(P0, P, Steps) :-
  projection_north(P0, P, Steps),
  projection_east(P0, P, Steps),
  Steps > 0.

%steps_north_west(+P0, ?P, ?Steps)
steps_north_west(P0, P, Steps) :-
  projection_north(P0, P, Steps),
  projection_west(P0, P, Steps),
  Steps > 0.

%steps_south_east(+P0, ?P, ?Steps)
steps_south_east(P0, P, Steps) :-
  projection_south(P0, P, Steps),
  projection_east(P0, P, Steps),
  Steps > 0.

%steps_south_west(+P0, ?P, ?Steps)
steps_south_west(P0, P, Steps) :-
  projection_south(P0, P, Steps),
  projection_west(P0, P, Steps),
  Steps > 0.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                  Relevant alignements between two points                   %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%aligned_north(+P0, +P)
aligned_north(P0, P) :- steps_north(P0, P, _).

%aligned_south(+P0, +P)
aligned_south(P0, P) :- steps_south(P0, P, _).

%aligned_east(+P0, +P)
aligned_east(P0, P) :- steps_east(P0, P, _).

%aligned_west(+P0, +P)
aligned_west(P0, P) :- steps_west(P0, P, _).


%aligned_north_east(+P0, +P)
aligned_north_east(P0, P) :- steps_north_east(P0, P, _).

%aligned_north_west(+P0, +P)
aligned_north_west(P0, P) :- steps_north_west(P0, P, _).

%aligned_east(point(+P0, +P)
aligned_south_east(P0, P) :- steps_south_east(P0, P, _).

%aligned_west(point(+P0, +P)
aligned_south_west(P0, P) :- steps_south_west(P0, P, _).


%aligned_vertically(+P0, +P)
aligned_vertically(P0, P) :- aligned_north(P0, P), !.  % green cut
aligned_vertically(P0, P) :- aligned_south(P0, P).

%aligned_horizontally(+P0, +P)
aligned_horizontally(P0, P) :- aligned_east(P0, P), !.  % green cut
aligned_horizontally(P0, P) :- aligned_west(P0, P).


%aligned_main_diagonal(+P0, +P)
aligned_main_diagonal(P0, P) :- aligned_north_west(P0, P), !.  % green cut
aligned_main_diagonal(P0, P) :- aligned_south_east(P0, P).

%aligned_anti_diagonal(+P0, +P)
aligned_anti_diagonal(P0, P) :- aligned_north_east(P0, P), !.  % green cut
aligned_anti_diagonal(P0, P) :- aligned_south_west(P0, P).


%aligned_axis(+P0, +P)
aligned_axis(P0, P) :- aligned_vertically(P0, P), !.  % green cut
aligned_axis(P0, P) :- aligned_horizontally(P0, P).

%aligned_diagonally(+P0, +P)
aligned_diagonal(P0, P) :- aligned_main_diagonal(P0, P), !.  % green cut
aligned_diagonal(P0, P) :- aligned_anti_diagonal(P0, P).


%aligned(+P0, +P)
aligned(P0, P) :- aligned_axis(P0, P), !.  % green cut
aligned(P0, P) :- aligned_diagonal(P0, P).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%               Lists of points between two (aligned) points                 %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%in_between_north(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_north(point(X0,Y0), point(X0,Y), [point(X0,Yi)]) :- Yi is Y0 + 1, Yi is Y - 1, !.  % green cut
in_between_north(point(X0,Y0), point(X0,Y), [point(X0,Yi) | Other_points]) :-
  Yi is Y0 + 1, Yi < Y,
  in_between_north(point(X0,Yi), point(X0,Y), Other_points).

%in_between_south(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_south(point(X0,Y0), point(X0,Y), [point(X0,Yi)]) :- Yi is Y0 - 1, Yi is Y + 1, !.  % green cut
in_between_south(point(X0,Y0), point(X0,Y), [point(X0,Yi) | Other_points]) :-
  Yi is Y0 - 1, Yi > Y,
  in_between_south(point(X0,Yi), point(X0,Y), Other_points).

%in_between_east(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_east(point(X0,Y0), point(X,Y0), [point(Xi,Y0)]) :- Xi is X0 + 1, Xi is X - 1, !.  % green cut
in_between_east(point(X0,Y0), point(X,Y0), [point(Xi,Y0) | Other_points]) :-
  Xi is X0 + 1, Xi < X,
  in_between_east(point(Xi,Y0), point(X,Y0), Other_points).

%in_between_west(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_west(point(X0,Y0), point(X,Y0), [point(Xi,Y0)]) :- Xi is X0 - 1, Xi is X + 1, !.  % green cut
in_between_west(point(X0,Y0), point(X,Y0), [point(Xi,Y0) | Other_points]) :-
  Xi is X0 - 1, Xi > X,
  in_between_west(point(Xi,Y0), point(X,Y0), Other_points).


%in_between_north_east(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_north_east(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :-
  Xi is X0 + 1, Xi is X - 1,
  Yi is Y0 + 1, Yi is Y - 1, !.  % green cut
in_between_north_east(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :-
  Xi is X0 + 1, Xi < X,
  Yi is Y0 + 1, Yi < Y,
  in_between_north_east(point(Xi,Yi), point(X,Y), Other_points).

%in_between_north_west(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_north_west(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :-
  Xi is X0 - 1, Xi is X + 1,
  Yi is Y0 + 1, Yi is Y - 1, !.  % green cut
in_between_north_west(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :-
  Xi is X0 - 1, Xi > X,
  Yi is Y0 + 1, Yi < Y,
  in_between_north_west(point(Xi,Yi), point(X,Y), Other_points).

%in_between_south_east(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_south_east(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :-
  Xi is X0 + 1, Xi is X - 1,
  Yi is Y0 - 1, Yi is Y + 1, !.  % green cut
in_between_south_east(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :-
  Xi is X0 + 1, Xi < X,
  Yi is Y0 - 1, Yi > Y,
  in_between_south_east(point(Xi,Yi), point(X,Y), Other_points).

%in_between_south_west(point(+X0,+Y0), point(+X,+Y), -Points)
in_between_south_west(point(X0,Y0), point(X,Y), [point(Xi,Yi)]) :-
  Xi is X0 - 1, Xi is X + 1,
  Yi is Y0 - 1, Yi is Y + 1, !.  % green cut
in_between_south_west(point(X0,Y0), point(X,Y), [point(Xi,Yi) | Other_points]) :-
  Xi is X0 - 1, Xi > X,
  Yi is Y0 - 1, Yi > Y,
  in_between_south_west(point(Xi,Yi), point(X,Y), Other_points).


%in_between(+P0, +P, -Points)
in_between(P0, P, Points) :- in_between_north(P0, P, Points), !.       % green cut
in_between(P0, P, Points) :- in_between_south(P0, P, Points), !.       % green cut
in_between(P0, P, Points) :- in_between_east(P0, P, Points), !.        % green cut
in_between(P0, P, Points) :- in_between_west(P0, P, Points), !.        % green cut
in_between(P0, P, Points) :- in_between_north_east(P0, P, Points), !.  % green cut
in_between(P0, P, Points) :- in_between_north_west(P0, P, Points), !.  % green cut
in_between(P0, P, Points) :- in_between_south_east(P0, P, Points), !.  % green cut
in_between(P0, P, Points) :- in_between_south_west(P0, P, Points).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                             Miscellaneous                                  %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%adjacent(+point(X0,Y0), ?point(X,Y))
adjacent(point(X0,Y0), point(X,Y)) :-
  (X is X0 - 1; X is X0; X is X0 + 1),
  (Y is Y0 - 1; Y is Y0; Y is Y0 + 1),
  not (X = X0, Y = Y0).  % comment out this subgoal to include the soultion where point(X,Y) is the same as point(X0,Y0)

%l_pattern(+point(X0,Y0), ?point(X,Y))
l_pattern(point(X0,Y0), point(X,Y)) :-
  (X is X0 + 2; X is X0 - 2),
  (Y is Y0 + 1; Y is Y0 - 1).
l_pattern(point(X0,Y0), point(X,Y)) :-
  (X is X0 + 1; X is X0 - 1),
  (Y is Y0 + 2; Y is Y0 - 2).
