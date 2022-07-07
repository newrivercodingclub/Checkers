/*

01010101/
10101010/
01010101/
00000000/
00000000/
20202020/
02020202/
20202020/



1's move additive in a single array
2's move subtractive in a single array
3's and 4's are kings and can move additive and subtractive, but must have their own checksums for enemy on jump

when 1's hit last 8 (55-63) array slot upgrades to 3, when 2's hit first 8 (0-7) slots upgrades to 4
forced move when take a peice take is available, if more than one legal forced take, user chooses move. 

*/

// function board_move(incoming_index, outbound_index, player){
//     incoming_index = 0
//     //do math to figure out what the piece will move over
//     if piece moves over oponent's piece -> index of oponents piece = 0
//     outbound_index = if_player1_1_or_player2_2
// }
