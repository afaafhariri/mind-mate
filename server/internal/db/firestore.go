package db

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

var Client *firestore.Client

func InitFirestore() {
	ctx := context.Background()
	sa := option.WithCredentialsFile("mind-mate-firebase-admin-sdk.json")
	app, err := firebase.NewApp(ctx, nil, sa)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	Client, err = app.Firestore(ctx)
	if err != nil {
		log.Fatalf("error initializing firestore: %v\n", err)
	}
	log.Println("Firestore initialized successfully")
}

func CloseFirestore() {
	if Client != nil {
		Client.Close()
	}
}
