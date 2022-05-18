{{/* Created by Krabs
	Part of the note system.
 
	Syntax is -clearnote <user>
	This command will clear all notes for the user.
*/}}
 
{{$args := parseArgs 1 "Syntax is `-ClearNotesPleaseDontDoThisIHaveAWifeAndFamily <userID>`" (carg "userid" "userID")}}
 
{{$notesCmd := 3}}
{{$modCategory := 975437545812942929}}
 
{{if ne .Channel.ParentID $modCategory}}
	{{deleteTrigger 0}}
{{end}}
 
{{if not (userArg ($args.Get 0))}}
	{{if eq .Channel.ParentID $modCategory}}
		{{sendMessage nil (joinStr "" .User.Mention ", please use a valid user ID or user mention.")}}
	{{else}}
		{{sendDM (joinStr "" .User.Mention ", please use a valid user ID or user mention.\n```" .Message.Content "```")}}
	{{end}}
{{else}}
	{{$user := (userArg ($args.Get 0))}}
	{{execCC $notesCmd nil 0 (sdict "UserID" $user.ID)}}
	{{dbDel $user.ID "notes"}}
 
	{{if eq .Channel.ParentID $modCategory}}
		{{sendMessage nil (joinStr "" .User.Mention ", the notes for " $user.Mention " have been cleared.")}}
	{{else}}
		{{sendDM (joinStr "" .User.Mention ", the notes for " $user.Mention " have been cleared.")}}
	{{end}}
 
{{end}}